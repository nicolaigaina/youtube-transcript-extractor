import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

interface TranscriptCardProps {
  transcript: {
    id: string;
    youtubeVideoId: string;
    youtubeTitle: string | null;
    youtubeChannel: string | null;
    wordCount: number;
    language: string | null;
    createdAt: Date;
  };
}

export function TranscriptCard({ transcript }: TranscriptCardProps) {
  return (
    <Link
      href={`/transcripts/${transcript.id}`}
      className="group flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-[#459F94]/30 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-[#459F94]/30"
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      {/* Thumbnail */}
      <img
        src={`https://img.youtube.com/vi/${transcript.youtubeVideoId}/mqdefault.jpg`}
        alt={transcript.youtubeTitle ?? "Video thumbnail"}
        className="h-20 w-36 shrink-0 rounded-xl object-cover"
      />

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <h3 className="truncate font-semibold text-gray-900 group-hover:text-[#459F94] dark:text-white dark:group-hover:text-[#459F94]">
            {transcript.youtubeTitle ?? "Untitled Video"}
          </h3>
          {transcript.youtubeChannel && (
            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
              {transcript.youtubeChannel}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#459F94]/10 px-2.5 py-0.5 text-xs font-medium text-[#459F94] dark:bg-[#459F94]/20 dark:text-[#459F94]">
            <FileText className="h-3 w-3" />
            {transcript.wordCount.toLocaleString()} words
          </span>
          {transcript.language && (
            <span className="rounded-full border border-gray-200 px-2.5 py-0.5 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
              {transcript.language}
            </span>
          )}
          <span className="ml-auto text-xs text-gray-400">
            {transcript.createdAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
          <ArrowRight className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-[#459F94] dark:text-gray-600" />
        </div>
      </div>
    </Link>
  );
}
