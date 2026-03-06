"use client";

import { Globe, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";

interface LanguagePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  languages: Array<{ code: string; name: string }>;
  onSelect: (languageCode: string) => void;
  isLoading?: boolean;
}

export function LanguagePickerDialog({
  open,
  onOpenChange,
  languages,
  onSelect,
  isLoading,
}: LanguagePickerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Select Language
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onSelect(lang.code)}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
              >
                <Badge variant="outline" className="font-mono text-xs">
                  {lang.code}
                </Badge>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
