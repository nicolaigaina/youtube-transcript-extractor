import Link from "next/link";
import { FileText } from "lucide-react";
import { Badge } from "~/components/ui/badge";

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
      className="group flex gap-4 rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50"
    >
      <img
        src={`https://img.youtube.com/vi/${transcript.youtubeVideoId}/mqdefault.jpg`}
        alt={transcript.youtubeTitle ?? "Video thumbnail"}
        className="h-20 w-36 shrink-0 rounded-md object-cover"
      />

      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <h3 className="truncate text-sm font-medium group-hover:text-primary">
            {transcript.youtubeTitle ?? "Untitled Video"}
          </h3>
          {transcript.youtubeChannel && (
            <p className="truncate text-xs text-muted-foreground">
              {transcript.youtubeChannel}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            <FileText className="mr-1 h-3 w-3" />
            {transcript.wordCount.toLocaleString()} words
          </Badge>
          {transcript.language && (
            <Badge variant="outline" className="text-xs">
              {transcript.language}
            </Badge>
          )}
          <span className="ml-auto text-xs text-muted-foreground">
            {transcript.createdAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}
