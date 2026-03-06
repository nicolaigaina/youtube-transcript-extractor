"""YouTube video URL parsing and validation utilities."""

import re

_PATTERNS = [
    r'(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)',
    r'youtube\.com\/embed\/([^&\n?#]+)',
    r'youtube\.com\/v\/([^&\n?#]+)',
    r'youtube\.com\/shorts\/([^&\n?#]+)',
]


def extract_video_id(url: str) -> str | None:
    """Extract YouTube video ID from various URL formats."""
    if not url:
        return None
    for pattern in _PATTERNS:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


def is_valid_youtube_url(url: str) -> bool:
    """Check if URL is a valid YouTube video URL."""
    return extract_video_id(url) is not None
