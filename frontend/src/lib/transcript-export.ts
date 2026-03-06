import jsPDF from "jspdf";

export interface TranscriptData {
  youtubeVideoId: string;
  youtubeTitle?: string | null;
  youtubeChannel?: string | null;
  transcriptText: string;
  wordCount: number;
  language?: string | null;
  createdAt?: Date;
  segments?: Array<{ text: string; start: number; duration: number }> | null;
  hasTimestamps?: boolean;
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 50);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function buildHeader(data: TranscriptData): string {
  const lines: string[] = [];
  if (data.youtubeTitle) lines.push(`Title: ${data.youtubeTitle}`);
  if (data.youtubeChannel) lines.push(`Channel: ${data.youtubeChannel}`);
  lines.push(`URL: https://youtube.com/watch?v=${data.youtubeVideoId}`);
  lines.push(`Words: ${data.wordCount.toLocaleString()}`);
  if (data.language) lines.push(`Language: ${data.language}`);
  if (data.createdAt) lines.push(`Extracted: ${formatDate(data.createdAt)}`);
  return lines.join("\n");
}

function getFilename(data: TranscriptData, ext: string): string {
  const base = data.youtubeTitle
    ? sanitizeFilename(data.youtubeTitle)
    : data.youtubeVideoId;
  return `${base}_transcript.${ext}`;
}

export function exportTranscriptTXT(data: TranscriptData): void {
  const header = buildHeader(data);
  const content = `${header}\n${"=".repeat(60)}\n\n${data.transcriptText}`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  downloadBlob(blob, getFilename(data, "txt"));
}

export function exportTranscriptPDF(data: TranscriptData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  if (data.youtubeTitle) {
    const titleLines = doc.splitTextToSize(data.youtubeTitle, maxWidth) as string[];
    doc.text(titleLines, margin, y);
    y += titleLines.length * 7 + 4;
  }

  // Metadata
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);

  const meta: string[] = [];
  if (data.youtubeChannel) meta.push(`Channel: ${data.youtubeChannel}`);
  meta.push(`URL: https://youtube.com/watch?v=${data.youtubeVideoId}`);
  meta.push(`Words: ${data.wordCount.toLocaleString()}`);
  if (data.language) meta.push(`Language: ${data.language}`);
  if (data.createdAt) meta.push(`Extracted: ${formatDate(data.createdAt)}`);

  for (const line of meta) {
    doc.text(line, margin, y);
    y += 4.5;
  }

  // Separator
  y += 4;
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Transcript body
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.setFont("helvetica", "normal");

  const lines = doc.splitTextToSize(data.transcriptText, maxWidth) as string[];
  const lineHeight = 4.5;
  const pageHeight = doc.internal.pageSize.getHeight();

  for (const line of lines) {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  }

  doc.save(getFilename(data, "pdf"));
}

export function exportTranscriptJSON(data: TranscriptData): void {
  const output: Record<string, unknown> = {
    youtubeVideoId: data.youtubeVideoId,
    url: `https://youtube.com/watch?v=${data.youtubeVideoId}`,
    title: data.youtubeTitle ?? null,
    channel: data.youtubeChannel ?? null,
    language: data.language ?? null,
    wordCount: data.wordCount,
    extractedAt: data.createdAt?.toISOString() ?? null,
    transcript: data.transcriptText,
  };

  if (data.hasTimestamps && data.segments?.length) {
    output.segments = data.segments;
  }

  const blob = new Blob([JSON.stringify(output, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  downloadBlob(blob, getFilename(data, "json"));
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
