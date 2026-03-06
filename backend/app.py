"""YouTube Transcript Extractor API — Flask backend."""

import os
from datetime import datetime, timezone

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

from transcript_service import (
    fetch_transcript,
    TranscriptsDisabledError,
    VideoUnavailableError,
)
from video_utils import extract_video_id

load_dotenv()

app = Flask(__name__)

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
CORS(app, origins=[frontend_url, "http://localhost:3000"])


def log(message: str, level: str = "INFO") -> None:
    timestamp = datetime.now(timezone.utc).isoformat()
    print(f"[{timestamp}] [{level}] {message}", flush=True)


@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({
        "status": "ok",
        "service": "youtube-transcript-extractor",
        "version": "1.0.0",
    })


@app.route("/api/transcript", methods=["POST"])
def get_transcript():
    """Fetch transcript for a YouTube video."""
    data = request.json
    if not data or not data.get("url"):
        return jsonify({"error": "Missing 'url' in request body"}), 400

    video_id = extract_video_id(data["url"])
    if not video_id:
        return jsonify({"error": "Invalid YouTube URL"}), 400

    language = data.get("language")
    include_timestamps = data.get("include_timestamps", False)

    log(f"Fetching transcript for {video_id} (lang={language}, timestamps={include_timestamps})")

    try:
        result = fetch_transcript(video_id, language, include_timestamps)
        log(f"Transcript fetched: {result.get('word_count', 0)} words, lang={result.get('language')}")
        return jsonify(result), 200

    except TranscriptsDisabledError as e:
        log(f"Transcripts disabled for {video_id}", "WARNING")
        return jsonify({"has_transcript": False, "error": str(e)}), 200

    except VideoUnavailableError as e:
        log(f"Video unavailable: {video_id}", "WARNING")
        return jsonify({"has_transcript": False, "error": str(e)}), 200

    except Exception as e:
        log(f"Error fetching transcript for {video_id}: {e}", "ERROR")
        return jsonify({"has_transcript": False, "error": f"Failed to fetch transcript: {str(e)}"}), 500


@app.route("/api/transcript/languages", methods=["POST"])
def get_languages():
    """List available transcript languages for a YouTube video."""
    data = request.json
    if not data or not data.get("url"):
        return jsonify({"error": "Missing 'url' in request body"}), 400

    video_id = extract_video_id(data["url"])
    if not video_id:
        return jsonify({"error": "Invalid YouTube URL"}), 400

    try:
        result = fetch_transcript(video_id)
        return jsonify({
            "available_languages": result.get("available_languages", []),
            "detected_language": result.get("language"),
        }), 200

    except (TranscriptsDisabledError, VideoUnavailableError) as e:
        return jsonify({"error": str(e), "available_languages": []}), 200

    except Exception as e:
        return jsonify({"error": str(e), "available_languages": []}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    log(f"Starting YouTube Transcript Extractor API on port {port}")
    app.run(host="0.0.0.0", port=port, debug=debug)
