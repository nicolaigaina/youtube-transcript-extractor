"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, ChevronUp, ChevronDown, X } from "lucide-react";
import { cn, formatTimestamp } from "~/lib/utils";

export interface SearchMatch {
  index: number;
  startOffset: number;
  endOffset: number;
  timestamp?: number;
  context: string;
}

interface TranscriptSearchProps {
  transcriptText: string;
  segments?: Array<{ text: string; start: number; duration: number }> | null;
  hasTimestamps: boolean;
  onHighlightChange: (matches: SearchMatch[], currentIndex: number) => void;
  onJumpToMatch?: (match: SearchMatch) => void;
  className?: string;
}

export function TranscriptSearch({
  transcriptText,
  segments,
  hasTimestamps,
  onHighlightChange,
  onJumpToMatch,
  className,
}: TranscriptSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<SearchMatch[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const findTimestamp = useCallback(
    (offset: number): number | undefined => {
      if (!hasTimestamps || !segments?.length) return undefined;
      let charCount = 0;
      for (const seg of segments) {
        const segLen = seg.text.length;
        if (charCount + segLen > offset) {
          return seg.start;
        }
        charCount += segLen + 1; // +1 for space/newline between segments
      }
      return undefined;
    },
    [segments, hasTimestamps],
  );

  const performSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setMatches([]);
        setCurrentIndex(0);
        onHighlightChange([], -1);
        return;
      }

      const lowerText = transcriptText.toLowerCase();
      const lowerQuery = searchQuery.toLowerCase();
      const found: SearchMatch[] = [];
      let startPos = 0;

      while (startPos < lowerText.length) {
        const idx = lowerText.indexOf(lowerQuery, startPos);
        if (idx === -1) break;

        const contextStart = Math.max(0, idx - 30);
        const contextEnd = Math.min(lowerText.length, idx + lowerQuery.length + 30);

        found.push({
          index: found.length,
          startOffset: idx,
          endOffset: idx + lowerQuery.length,
          timestamp: findTimestamp(idx),
          context: transcriptText.slice(contextStart, contextEnd),
        });

        startPos = idx + 1;
      }

      setMatches(found);
      const newIndex = found.length > 0 ? 0 : -1;
      setCurrentIndex(newIndex === -1 ? 0 : newIndex);
      onHighlightChange(found, newIndex);

      if (found.length > 0 && onJumpToMatch) {
        onJumpToMatch(found[0]!);
      }
    },
    [transcriptText, findTimestamp, onHighlightChange, onJumpToMatch],
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => performSearch(query), 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, performSearch]);

  function goToMatch(direction: "next" | "prev") {
    if (matches.length === 0) return;
    const newIndex =
      direction === "next"
        ? (currentIndex + 1) % matches.length
        : (currentIndex - 1 + matches.length) % matches.length;
    setCurrentIndex(newIndex);
    onHighlightChange(matches, newIndex);
    if (onJumpToMatch && matches[newIndex]) {
      onJumpToMatch(matches[newIndex]);
    }
  }

  function clearSearch() {
    setQuery("");
    setMatches([]);
    setCurrentIndex(0);
    onHighlightChange([], -1);
    setIsOpen(false);
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        clearSearch();
      } else if (e.key === "Enter" && isOpen && matches.length > 0) {
        e.preventDefault();
        goToMatch(e.shiftKey ? "prev" : "next");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, matches, currentIndex]);

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className={cn(
          "flex items-center gap-1 rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-foreground",
          className,
        )}
        aria-label="Search transcript"
      >
        <Search className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className={cn("flex items-center gap-1 rounded-md border bg-background px-2 py-1", className)}>
      <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="w-32 bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:w-48"
      />

      {query && (
        <span className="shrink-0 text-xs text-muted-foreground">
          {matches.length > 0 ? `${currentIndex + 1}/${matches.length}` : "0/0"}
        </span>
      )}

      {query && matches.length > 0 && matches[currentIndex]?.timestamp !== undefined && (
        <span className="shrink-0 rounded bg-muted px-1 text-xs text-muted-foreground">
          {formatTimestamp(matches[currentIndex]!.timestamp!)}
        </span>
      )}

      <button
        onClick={() => goToMatch("prev")}
        disabled={matches.length === 0}
        className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
        aria-label="Previous match"
      >
        <ChevronUp className="h-3.5 w-3.5" />
      </button>

      <button
        onClick={() => goToMatch("next")}
        disabled={matches.length === 0}
        className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
        aria-label="Next match"
      >
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      <button
        onClick={clearSearch}
        className="p-0.5 text-muted-foreground hover:text-foreground"
        aria-label="Close search"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
