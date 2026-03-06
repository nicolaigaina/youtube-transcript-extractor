import { getTranscriptById } from "~/actions/transcripts";
import { TranscriptViewer } from "~/components/transcript-viewer";
import Link from "next/link";

export default async function TranscriptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const transcript = await getTranscriptById(id);

  if (!transcript) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Transcript Not Found</h1>
        <p className="text-muted-foreground">
          This transcript doesn&apos;t exist or has been deleted.
        </p>
        <Link href="/" className="text-primary hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  return <TranscriptViewer transcript={transcript} />;
}
