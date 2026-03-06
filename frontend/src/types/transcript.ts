export interface TranscriptSegment {
  text: string;
  start: number;
  duration: number;
}

export interface TranscriptLanguage {
  code: string;
  name: string;
}

export interface CachedTranscript {
  text: string;
  wordCount: number;
  name: string;
  segments?: TranscriptSegment[];
}

export interface Transcript {
  id: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  youtubeTitle: string | null;
  youtubeChannel: string | null;
  transcriptText: string;
  wordCount: number;
  language: string | null;
  availableLanguages: TranscriptLanguage[] | null;
  segments: TranscriptSegment[] | null;
  hasTimestamps: boolean;
  status: string;
  errorMessage: string | null;
  createdAt: Date;
}

export interface TranscriptListItem {
  id: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  youtubeTitle: string | null;
  youtubeChannel: string | null;
  wordCount: number;
  language: string | null;
  status: string;
  createdAt: Date;
}
