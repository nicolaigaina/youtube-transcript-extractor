"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/lib/db";
import { env } from "~/lib/env";
import { extractVideoId } from "~/lib/validators";

export async function fetchTranscript(
  youtubeUrl: string,
  preferredLanguage?: string,
  includeTimestamps = false,
): Promise<{
  transcriptId: string;
  isExisting: boolean;
  error?: string;
}> {
  const videoId = extractVideoId(youtubeUrl);
  if (!videoId) {
    return { transcriptId: "", isExisting: false, error: "Invalid YouTube URL" };
  }

  // Deduplication: reuse existing transcript
  const existing = await db.transcript.findFirst({
    where: { youtubeVideoId: videoId },
  });

  const needsTimestampUpgrade =
    existing && includeTimestamps && !existing.hasTimestamps;
  const needsMetadata =
    existing && (!existing.youtubeTitle || !existing.youtubeChannel);

  if (existing && !needsTimestampUpgrade && !needsMetadata) {
    return { transcriptId: existing.id, isExisting: true };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);

    const response = await fetch(`${env.BACKEND_URL}/api/transcript`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: youtubeUrl,
        language: preferredLanguage,
        include_timestamps: includeTimestamps,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = (await response.json()) as {
      has_transcript: boolean;
      transcript?: string;
      word_count?: number;
      language?: string;
      title?: string;
      channel?: string;
      segments?: Array<{ text: string; start: number; duration: number }>;
      available_languages?: Array<{ code: string; name: string }>;
      all_transcripts?: Record<
        string,
        {
          text: string;
          wordCount: number;
          name: string;
          segments?: Array<{ text: string; start: number; duration: number }>;
        } | null
      >;
      error?: string;
    };

    if (!data.has_transcript || !data.transcript) {
      const errorMsg = data.error ?? "Transcript not available for this video";

      const failed = await db.transcript.create({
        data: {
          youtubeUrl,
          youtubeVideoId: videoId,
          transcriptText: "",
          wordCount: 0,
          status: "failed",
          errorMessage: errorMsg,
        },
      });

      return { transcriptId: failed.id, isExisting: false, error: errorMsg };
    }

    const formattedText = data.transcript.replace(/\s*>>\s*/g, "\n\n");

    if (existing && (needsTimestampUpgrade || needsMetadata)) {
      await db.transcript.update({
        where: { id: existing.id },
        data: {
          ...(needsMetadata && data.title && { youtubeTitle: data.title }),
          ...(needsMetadata && data.channel && { youtubeChannel: data.channel }),
          ...(needsTimestampUpgrade && data.segments && { segments: JSON.stringify(data.segments) }),
          ...(needsTimestampUpgrade && { hasTimestamps: !!data.segments?.length }),
          ...(data.all_transcripts && {
            allLanguageTranscripts: JSON.stringify(data.all_transcripts),
          }),
        },
      });

      revalidatePath("/history");
      return { transcriptId: existing.id, isExisting: true };
    }

    const transcript = await db.transcript.create({
      data: {
        youtubeUrl,
        youtubeVideoId: videoId,
        youtubeTitle: data.title ?? null,
        youtubeChannel: data.channel ?? null,
        transcriptText: formattedText,
        wordCount: data.word_count ?? 0,
        language: data.language,
        ...(data.available_languages && {
          availableLanguages: JSON.stringify(data.available_languages),
        }),
        ...(data.all_transcripts && {
          allLanguageTranscripts: JSON.stringify(data.all_transcripts),
        }),
        ...(data.segments && { segments: JSON.stringify(data.segments) }),
        hasTimestamps: !!data.segments?.length,
        status: "completed",
      },
    });

    revalidatePath("/history");
    return { transcriptId: transcript.id, isExisting: false };
  } catch (error) {
    const errorMsg =
      error instanceof Error && error.name === "AbortError"
        ? "Request timed out. Please try again."
        : error instanceof Error
          ? error.message
          : "Failed to fetch transcript";

    return { transcriptId: "", isExisting: false, error: errorMsg };
  }
}

export async function getTranscriptById(id: string) {
  const transcript = await db.transcript.findUnique({ where: { id } });
  if (!transcript) return null;

  return {
    ...transcript,
    availableLanguages: transcript.availableLanguages
      ? (JSON.parse(transcript.availableLanguages) as Array<{
          code: string;
          name: string;
        }>)
      : null,
    segments: transcript.segments
      ? (JSON.parse(transcript.segments) as Array<{
          text: string;
          start: number;
          duration: number;
        }>)
      : null,
  };
}

export async function getTranscripts(page = 1, limit = 20) {
  const [transcripts, total] = await Promise.all([
    db.transcript.findMany({
      where: { status: "completed" },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        youtubeUrl: true,
        youtubeVideoId: true,
        youtubeTitle: true,
        youtubeChannel: true,
        wordCount: true,
        language: true,
        status: true,
        createdAt: true,
      },
    }),
    db.transcript.count({ where: { status: "completed" } }),
  ]);

  return { transcripts, total, page, totalPages: Math.ceil(total / limit) };
}

export async function switchTranscriptLanguage(
  transcriptId: string,
  languageCode: string,
): Promise<{ success: boolean; error?: string }> {
  const transcript = await db.transcript.findUnique({
    where: { id: transcriptId },
  });

  if (!transcript) {
    return { success: false, error: "Transcript not found" };
  }

  if (!transcript.allLanguageTranscripts) {
    return { success: false, error: "No cached transcripts available" };
  }

  const allTranscripts = JSON.parse(
    transcript.allLanguageTranscripts,
  ) as Record<
    string,
    {
      text: string;
      wordCount: number;
      name: string;
      segments?: Array<{ text: string; start: number; duration: number }>;
    } | null
  >;

  const cached = allTranscripts[languageCode];
  if (!cached) {
    return { success: false, error: `Language ${languageCode} not available` };
  }

  await db.transcript.update({
    where: { id: transcriptId },
    data: {
      transcriptText: cached.text,
      wordCount: cached.wordCount,
      language: languageCode,
      ...(cached.segments && { segments: JSON.stringify(cached.segments) }),
      hasTimestamps: !!cached.segments?.length,
    },
  });

  revalidatePath(`/transcripts/${transcriptId}`);
  revalidatePath("/history");
  return { success: true };
}

export async function deleteTranscript(
  transcriptId: string,
): Promise<{ success: boolean; error?: string }> {
  const transcript = await db.transcript.findUnique({
    where: { id: transcriptId },
  });

  if (!transcript) {
    return { success: false, error: "Transcript not found" };
  }

  await db.transcript.delete({ where: { id: transcriptId } });

  revalidatePath("/history");
  return { success: true };
}
