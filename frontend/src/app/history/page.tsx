import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { getTranscripts } from "~/actions/transcripts";
import { TranscriptCard } from "~/components/transcript-card";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const { transcripts, total } = await getTranscripts();

  return (
    <div
      className="container mx-auto max-w-4xl px-4 pt-24 pb-16"
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Transcript{" "}
          <span className="bg-gradient-to-r from-[#459F94] to-[#EDB118] bg-clip-text text-transparent">
            History
          </span>
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {total > 0
            ? `${total} transcript${total === 1 ? "" : "s"} extracted`
            : "No transcripts yet. Extract your first one!"}
        </p>
      </div>

      {transcripts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-gray-300 py-20 text-center dark:border-gray-700">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#459F94]/10 dark:bg-[#459F94]/20">
            <FileText className="h-8 w-8 text-[#459F94]" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              No transcripts yet
            </p>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Paste a YouTube URL to extract your first transcript.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#459F94] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#367d74]"
          >
            Extract Transcript
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {transcripts.map((transcript) => (
            <TranscriptCard key={transcript.id} transcript={transcript} />
          ))}
        </div>
      )}
    </div>
  );
}
