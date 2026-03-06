"use client";

import { useState } from "react";
import { Download, FileText, FileJson, FileIcon } from "lucide-react";
import { toast } from "sonner";
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
import { Button } from "~/components/ui/button";

interface ExportMenuProps {
  transcript: TranscriptData;
}

export function ExportMenu({ transcript }: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState(false);

  function handleExportTXT() {
    try {
      setIsExporting(true);
      exportTranscriptTXT(transcript);
      toast.success("Exported as TXT");
    } catch {
      toast.error("Failed to export");
    } finally {
      setIsExporting(false);
    }
  }

  async function handleExportPDF() {
    try {
      setIsExporting(true);
      await exportTranscriptPDF(transcript);
      toast.success("Exported as PDF");
    } catch (error) {
      console.error("PDF export failed:", error);
      toast.error("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  }

  function handleExportJSON() {
    try {
      setIsExporting(true);
      exportTranscriptJSON(transcript);
      toast.success("Exported as JSON");
    } catch {
      toast.error("Failed to export");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" disabled={isExporting}>
            <Download className="mr-1.5 h-4 w-4" />
            Export
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportTXT}>
          <FileText className="mr-2 h-4 w-4" />
          Plain Text (.txt)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF}>
          <FileIcon className="mr-2 h-4 w-4" />
          PDF Document (.pdf)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportJSON}>
          <FileJson className="mr-2 h-4 w-4" />
          JSON (.json)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
