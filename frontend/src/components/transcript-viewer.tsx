"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Trash2,
  Globe,
  Clock,
  FileText,
  ExternalLink,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { cn, formatTimestamp } from "~/lib/utils";
import { deleteTranscript, switchTranscriptLanguage } from "~/actions/transcripts";
import {
  TranscriptSearch,
  type SearchMatch,
} from "~/components/transcript-search";
import { LanguagePickerDialog } from "~/components/language-picker";
import { ExportMenu } from "~/components/export-menu";

interface TranscriptViewerProps {
  transcript: {
    id: string;
    youtubeUrl: string;
    youtubeVideoId: string;
    youtubeTitle: string | null;
    youtubeChannel: string | null;
    transcriptText: string;
    wordCount: number;
    language: string | null;
    availableLanguages: Array<{ code: string; name: string }> | null;
    segments: Array<{ text: string; start: number; duration: number }> | null;
    hasTimestamps: boolean;
    status: string;
    errorMessage: string | null;
    createdAt: Date;
  };
}

export function TranscriptViewer({ transcript }: TranscriptViewerProps) {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);

  const [searchMatches, setSearchMatches] = useState<SearchMatch[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const [languagePickerOpen, setLanguagePickerOpen] = useState(false);
  const [isSwitchingLanguage, setIsSwitchingLanguage] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleHighlightChange = useCallback(
    (matches: SearchMatch[], index: number) => {
      setSearchMatches(matches);
      setCurrentMatchIndex(index);
    },
    [],
  );

  const handleJumpToMatch = useCallback((match: SearchMatch) => {
    if (!contentRef.current) return;
    const marks = contentRef.current.querySelectorAll("mark[data-match-index]");
    const target = Array.from(marks).find(
      (el) => el.getAttribute("data-match-index") === String(match.index),
    );
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(transcript.transcriptText);
      toast.success("Transcript copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deleteTranscript(transcript.id);
    if (result.success) {
      toast.success("Transcript deleted");
      router.push("/history");
    } else {
      toast.error(result.error ?? "Failed to delete");
      setIsDeleting(false);
    }
  }

  async function handleLanguageSwitch(languageCode: string) {
    setIsSwitchingLanguage(true);
    setLanguagePickerOpen(false);

    const result = await switchTranscriptLanguage(transcript.id, languageCode);
    if (result.success) {
      toast.success("Language switched");
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to switch language");
    }
    setIsSwitchingLanguage(false);
  }

  const highlightedText = useMemo(() => {
    if (searchMatches.length === 0) return null;

    const parts: Array<{
      text: string;
      matchIndex: number | null;
      isCurrent: boolean;
    }> = [];
    let lastEnd = 0;

    const sorted = [...searchMatches].sort(
      (a, b) => a.startOffset - b.startOffset,
    );

    for (const match of sorted) {
      if (match.startOffset > lastEnd) {
        parts.push({
          text: transcript.transcriptText.slice(lastEnd, match.startOffset),
          matchIndex: null,
          isCurrent: false,
        });
      }
      parts.push({
        text: transcript.transcriptText.slice(
          match.startOffset,
          match.endOffset,
        ),
        matchIndex: match.index,
        isCurrent: match.index === currentMatchIndex,
      });
      lastEnd = match.endOffset;
    }

    if (lastEnd < transcript.transcriptText.length) {
      parts.push({
        text: transcript.transcriptText.slice(lastEnd),
        matchIndex: null,
        isCurrent: false,
      });
    }

    return parts;
  }, [searchMatches, currentMatchIndex, transcript.transcriptText]);

  const hasMultipleLanguages =
    transcript.availableLanguages && transcript.availableLanguages.length > 1;

  return (
    <div className="mx-auto max-w-5xl px-4 pt-24 pb-16">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            render={<Link href="/history" />}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold">
              {transcript.youtubeTitle ?? "Untitled Video"}
            </h1>
            {transcript.youtubeChannel && (
              <p className="text-sm text-muted-foreground">
                {transcript.youtubeChannel}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TranscriptSearch
            transcriptText={transcript.transcriptText}
            segments={transcript.segments}
            hasTimestamps={transcript.hasTimestamps}
            onHighlightChange={handleHighlightChange}
            onJumpToMatch={handleJumpToMatch}
          />

          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">Copy</span>
          </Button>

          <ExportMenu
            transcript={{
              youtubeVideoId: transcript.youtubeVideoId,
              youtubeTitle: transcript.youtubeTitle,
              youtubeChannel: transcript.youtubeChannel,
              transcriptText: transcript.transcriptText,
              wordCount: transcript.wordCount,
              language: transcript.language,
              createdAt: transcript.createdAt,
              segments: transcript.segments,
              hasTimestamps: transcript.hasTimestamps,
            }}
          />

          <AlertDialog>
            <AlertDialogTrigger
              render={<Button variant="outline" size="sm" className="text-destructive" />}
            >
              <Trash2 className="h-4 w-4" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete transcript?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this transcript. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Error state */}
      {transcript.status === "failed" && (
        <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {transcript.errorMessage ?? "Failed to extract transcript"}
        </div>
      )}

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Transcript text */}
        <div
          ref={contentRef}
          className="rounded-lg border bg-card p-6 text-sm leading-relaxed whitespace-pre-wrap"
        >
          {highlightedText
            ? highlightedText.map((part, i) =>
                part.matchIndex !== null ? (
                  <mark
                    key={i}
                    data-match-index={part.matchIndex}
                    className={cn(
                      "rounded-sm px-0.5",
                      part.isCurrent
                        ? "bg-teal-400/60 dark:bg-teal-500/50"
                        : "bg-yellow-200/80 dark:bg-yellow-500/30",
                    )}
                  >
                    {part.text}
                  </mark>
                ) : (
                  <span key={i}>{part.text}</span>
                ),
              )
            : transcript.hasTimestamps && transcript.segments && transcript.segments.length > 0
              ? transcript.segments.map((segment, i) => (
                  <p key={i} className="mb-2 last:mb-0">
                    <span className="mr-2 inline-block font-mono text-xs text-muted-foreground">
                      {formatTimestamp(segment.start, true)}
                    </span>
                    {segment.text}
                  </p>
                ))
              : transcript.transcriptText}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Thumbnail */}
          <div className="overflow-hidden rounded-lg border">
            <img
              src={`https://img.youtube.com/vi/${transcript.youtubeVideoId}/mqdefault.jpg`}
              alt={transcript.youtubeTitle ?? "Video thumbnail"}
              className="aspect-video w-full object-cover"
            />
          </div>

          {/* Metadata */}
          <div className="space-y-3 rounded-lg border bg-card p-4 text-sm">
            <a
              href={transcript.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-primary hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Watch on YouTube
            </a>

            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              {transcript.wordCount.toLocaleString()} words
            </div>

            {/* Language */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="h-3.5 w-3.5" />
              <span>{transcript.language ?? "Unknown"}</span>
              {hasMultipleLanguages && (
                <button
                  onClick={() => setLanguagePickerOpen(true)}
                  disabled={isSwitchingLanguage}
                  className="ml-auto text-xs text-primary hover:underline disabled:opacity-50"
                >
                  {isSwitchingLanguage ? "Switching..." : "Change"}
                </button>
              )}
            </div>

            {hasMultipleLanguages && (
              <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <Info className="mt-0.5 h-3 w-3 shrink-0" />
                {transcript.availableLanguages!.length} languages available.
                Click &quot;Change&quot; to switch.
              </p>
            )}

            {/* Timestamps */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {transcript.hasTimestamps ? "Timestamps included" : "No timestamps"}
            </div>

            {/* Date */}
            <div className="pt-2 text-xs text-muted-foreground">
              Extracted{" "}
              {transcript.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* Language picker */}
      {transcript.availableLanguages && (
        <LanguagePickerDialog
          open={languagePickerOpen}
          onOpenChange={setLanguagePickerOpen}
          languages={transcript.availableLanguages}
          onSelect={handleLanguageSwitch}
          isLoading={isSwitchingLanguage}
        />
      )}
    </div>
  );
}
