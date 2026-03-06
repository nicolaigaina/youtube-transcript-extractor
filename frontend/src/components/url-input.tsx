"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardPaste, Loader2, FileText, ArrowRight } from "lucide-react";
import { toast } from "sonner";
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
      toast.error(
        "Invalid YouTube URL. Please enter a valid YouTube video link.",
      );
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
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-2xl space-y-4"
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      {/* Input row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="url"
            placeholder="Paste a YouTube URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            className="h-14 w-full rounded-2xl border-2 border-gray-200 bg-white px-5 pr-12 text-base text-gray-900 shadow-sm transition-all placeholder:text-gray-400 focus:border-[#459F94] focus:ring-4 focus:ring-[#459F94]/10 focus:outline-none disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#459F94] dark:focus:ring-[#459F94]/20"
          />
          <button
            type="button"
            onClick={handlePaste}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Paste from clipboard"
          >
            <ClipboardPaste className="h-5 w-5" />
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex h-14 cursor-pointer items-center gap-2 rounded-2xl bg-[#459F94] px-6 font-semibold text-white shadow-sm transition-all hover:bg-[#367d74] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 sm:px-8"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="hidden sm:inline">Extracting...</span>
            </>
          ) : (
            <>
              <FileText className="h-5 w-5 sm:hidden" />
              <span className="hidden sm:inline">Extract</span>
              <ArrowRight className="hidden h-4 w-4 sm:block" />
            </>
          )}
        </button>
      </div>

      {/* Timestamp toggle */}
      <div className="flex items-center justify-center">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-500 dark:text-gray-400">
          <input
            type="checkbox"
            checked={includeTimestamps}
            onChange={(e) => setIncludeTimestamps(e.target.checked)}
            disabled={isLoading}
            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-[#459F94] accent-[#459F94]"
          />
          Include timestamps
        </label>
      </div>
    </form>
  );
}
