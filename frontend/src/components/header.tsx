"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { FileText, Github, Moon, Sun } from "lucide-react";
import { Button } from "~/components/ui/button";

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <FileText className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline">YouTube Transcript Extractor</span>
          <span className="sm:hidden">YT Transcripts</span>
        </Link>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" render={<Link href="/history" />}>
            History
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            render={
              <a
                href="https://github.com/nicolaigaina/youtube-transcript-extractor"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
              />
            }
          >
            <Github className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
