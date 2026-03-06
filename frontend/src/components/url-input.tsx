"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardPaste, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { isValidYouTubeUrl } from "~/lib/validators";
import { fetchTranscript } from "~/actions/transcripts";

export function UrlInput() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [includeTimestamps, setIncludeTimestamps] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch {
      toast.error("Failed to read clipboard");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = url.trim();
    if (!trimmed) {
      toast.error("Please enter a YouTube URL");
      return;
    }

    if (!isValidYouTubeUrl(trimmed)) {
      toast.error("Invalid YouTube URL. Please enter a valid YouTube video link.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await fetchTranscript(trimmed, undefined, includeTimestamps);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.isExisting) {
        toast.info("Transcript already exists, loading it now.");
      }

      router.push(`/transcripts/${result.transcriptId}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-xl space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="url"
            placeholder="Paste a YouTube URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            className="pr-10"
          />
          <button
            type="button"
            onClick={handlePaste}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Paste from clipboard"
          >
            <ClipboardPaste className="h-4 w-4" />
          </button>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {isLoading ? "Extracting..." : "Extract"}
          </span>
        </Button>
      </div>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={includeTimestamps}
          onChange={(e) => setIncludeTimestamps(e.target.checked)}
          disabled={isLoading}
          className="rounded border-input"
        />
        Include timestamps
      </label>
    </form>
  );
}
