"use client";

import { Download, FileText, FileJson, FileIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  exportTranscriptTXT,
  exportTranscriptPDF,
  exportTranscriptJSON,
  type TranscriptData,
} from "~/lib/transcript-export";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface ExportMenuProps {
  transcript: TranscriptData;
}

export function ExportMenu({ transcript }: ExportMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        <Download className="mr-1.5 h-4 w-4" />
        Export
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => exportTranscriptTXT(transcript)}>
          <FileText className="mr-2 h-4 w-4" />
          Plain Text (.txt)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportTranscriptPDF(transcript)}>
          <FileIcon className="mr-2 h-4 w-4" />
          PDF Document (.pdf)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportTranscriptJSON(transcript)}>
          <FileJson className="mr-2 h-4 w-4" />
          JSON (.json)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
