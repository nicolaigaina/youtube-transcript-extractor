"""Core transcript extraction service using youtube-transcript-api."""

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.proxies import GenericProxyConfig
from youtube_transcript_api._errors import TranscriptsDisabled, VideoUnavailable

from proxy_config import get_proxy_config


class TranscriptError(Exception):
    """Base error for transcript operations."""
    pass


class TranscriptsDisabledError(TranscriptError):
    pass


class VideoUnavailableError(TranscriptError):
    pass


def fetch_transcript(
    video_id: str,
    language: str | None = None,
    include_timestamps: bool = False,
) -> dict:
    """Fetch transcript for a YouTube video.

    Args:
        video_id: YouTube video ID.
        language: Preferred language code (optional).
        include_timestamps: Include segment-level timestamps.

    Returns:
        Dict with transcript data.

    Raises:
        TranscriptsDisabledError: Transcripts disabled by uploader.
        VideoUnavailableError: Video not found or private.
    """
    try:
        proxies = get_proxy_config()
        if proxies:
            api = YouTubeTranscriptApi(
                proxy_config=GenericProxyConfig(
                    http_url=proxies["http"],
                    https_url=proxies["https"],
                )
            )
        else:
            api = YouTubeTranscriptApi()

        transcript_listing = api.list(video_id)

        manual_transcripts = {}
        auto_transcripts = {}

        for t in transcript_listing:
            if t.is_generated:
                auto_transcripts[t.language_code] = t
            else:
                manual_transcripts[t.language_code] = t

        native_language = list(auto_transcripts.keys())[0] if auto_transcripts else None

        selected = _select_transcript(
            manual_transcripts, auto_transcripts, language, native_language
        )

        if not selected:
            return _no_transcript("No transcript available for this video")

        transcript_list = selected.fetch()
        detected_language = selected.language_code

        full_text = " ".join(segment.text for segment in transcript_list)
        full_text = full_text.replace(" >> ", "\n\n")
        word_count = len(full_text.split())

        response = {
            "has_transcript": True,
            "transcript": full_text,
            "word_count": word_count,
            "language": detected_language,
            "error": None,
        }

        if include_timestamps:
            response["segments"] = [
                {
                    "text": s.text,
                    "start": round(s.start, 2),
                    "duration": round(s.duration, 2),
                }
                for s in transcript_list
            ]

        total = len(manual_transcripts) + len(auto_transcripts)
        if total > 1:
            available = []
            for t in manual_transcripts.values():
                available.append({"code": t.language_code, "name": t.language})
            for t in auto_transcripts.values():
                available.append({"code": t.language_code, "name": f"{t.language} (auto)"})
            response["available_languages"] = available

            response["all_transcripts"] = _cache_all_transcripts(
                manual_transcripts, auto_transcripts, include_timestamps
            )

        return response

    except TranscriptsDisabled:
        raise TranscriptsDisabledError("Transcripts are disabled for this video")
    except VideoUnavailable:
        raise VideoUnavailableError("Video is unavailable")


def _select_transcript(manual, auto, preferred, native):
    """Select best transcript based on priority."""
    if preferred:
        if preferred in manual:
            return manual[preferred]
        if preferred in auto:
            return auto[preferred]

    if native:
        if native in manual:
            return manual[native]
        if native in auto:
            return auto[native]

    if manual:
        return list(manual.values())[0]
    if auto:
        return list(auto.values())[0]

    return None


def _cache_all_transcripts(manual, auto, include_timestamps):
    """Fetch and cache all language transcripts."""
    cache = {}
    for lang_code, transcript_obj in {**manual, **auto}.items():
        try:
            fetched = transcript_obj.fetch()
            text = " ".join(s.text for s in fetched)
            text = text.replace(" >> ", "\n\n")
            entry = {
                "text": text,
                "wordCount": len(text.split()),
                "name": (
                    f"{transcript_obj.language} (auto)"
                    if transcript_obj.is_generated
                    else transcript_obj.language
                ),
            }
            if include_timestamps:
                entry["segments"] = [
                    {"text": s.text, "start": round(s.start, 2), "duration": round(s.duration, 2)}
                    for s in fetched
                ]
            cache[lang_code] = entry
        except Exception:
            cache[lang_code] = None
    return cache


def _no_transcript(error: str) -> dict:
    return {
        "has_transcript": False,
        "transcript": None,
        "word_count": 0,
        "language": None,
        "error": error,
    }
