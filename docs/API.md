# API Documentation

The backend exposes a REST API for transcript extraction.

**Base URL:** `http://localhost:5000`

---

## Endpoints

### Health Check

```
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "service": "youtube-transcript-extractor",
  "version": "1.0.0"
}
```

---

### Extract Transcript

```
POST /api/transcript
```

Extract transcript from a YouTube video.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "language": "en",
  "include_timestamps": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | Yes | YouTube video URL |
| `language` | string | No | Preferred language code |
| `include_timestamps` | boolean | No | Include segment timestamps (default: false) |

**Success Response (200):**
```json
{
  "has_transcript": true,
  "transcript": "Full transcript text...",
  "word_count": 5000,
  "language": "en",
  "segments": [
    {
      "text": "Hello and welcome",
      "start": 0.0,
      "duration": 2.5
    }
  ],
  "available_languages": [
    { "code": "en", "name": "English" },
    { "code": "es", "name": "Spanish (auto)" }
  ],
  "all_transcripts": {
    "en": {
      "text": "Full English text...",
      "wordCount": 5000,
      "name": "English",
      "segments": []
    },
    "es": {
      "text": "Texto completo en espanol...",
      "wordCount": 4800,
      "name": "Spanish (auto)",
      "segments": []
    }
  },
  "error": null
}
```

**No Transcript Response (200):**
```json
{
  "has_transcript": false,
  "error": "Transcripts are disabled for this video"
}
```

**Error Response (400):**
```json
{
  "error": "Invalid YouTube URL"
}
```

**Notes:**
- `segments` only included when `include_timestamps: true`
- `available_languages` only included when multiple languages exist
- `all_transcripts` cached for instant language switching on frontend
- Returns 200 even for "no transcript" cases (not 4xx) -- check `has_transcript` field

---

### List Available Languages

```
POST /api/transcript/languages
```

List available transcript languages without fetching full content.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Response (200):**
```json
{
  "available_languages": [
    { "code": "en", "name": "English" },
    { "code": "es", "name": "Spanish (auto)" }
  ],
  "detected_language": "en"
}
```

---

## Supported YouTube URL Formats

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/v/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`

## Error Handling

| Scenario | HTTP Status | `has_transcript` | Error Message |
|----------|-------------|------------------|---------------|
| Missing URL | 400 | -- | "Missing 'url' in request body" |
| Invalid URL | 400 | -- | "Invalid YouTube URL" |
| Transcripts disabled | 200 | false | "Transcripts are disabled for this video" |
| Video unavailable | 200 | false | "Video is unavailable" |
| Network error | 500 | false | "Failed to fetch transcript: ..." |

## Proxy Configuration

For high-volume usage, configure Oxylabs residential proxy:

```bash
OXYLABS_RESIDENTIAL_USERNAME=your_username
OXYLABS_RESIDENTIAL_PASSWORD=your_password
```

Without proxy credentials, the API connects to YouTube directly (works fine for moderate usage).
