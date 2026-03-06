import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 text-sm text-muted-foreground">
        <p>
          Built by the team behind{" "}
          <a
            href="https://autoshorts.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            AutoShorts
          </a>
        </p>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/nicolaigaina/youtube-transcript-extractor"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
          <span className="rounded-full border px-2 py-0.5 text-xs">
            MIT License
          </span>
        </div>
      </div>
    </footer>
  );
}
