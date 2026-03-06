import { getTranscripts } from "~/actions/transcripts";
import { TranscriptCard } from "~/components/transcript-card";

export default async function HistoryPage() {
  const { transcripts, total } = await getTranscripts();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Transcript History</h1>
        <p className="mt-2 text-muted-foreground">
          {total > 0
            ? `${total} transcript${total === 1 ? "" : "s"} extracted`
            : "No transcripts yet"}
        </p>
      </div>

      {transcripts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <p className="text-lg text-muted-foreground">No transcripts yet.</p>
          <a href="/" className="text-primary hover:underline">
            Extract your first transcript
          </a>
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
