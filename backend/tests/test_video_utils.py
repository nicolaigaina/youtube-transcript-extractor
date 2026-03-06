import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from video_utils import extract_video_id, is_valid_youtube_url


def test_extract_standard_url():
    assert extract_video_id("https://www.youtube.com/watch?v=dQw4w9WgXcQ") == "dQw4w9WgXcQ"


def test_extract_short_url():
    assert extract_video_id("https://youtu.be/dQw4w9WgXcQ") == "dQw4w9WgXcQ"


def test_extract_embed_url():
    assert extract_video_id("https://www.youtube.com/embed/dQw4w9WgXcQ") == "dQw4w9WgXcQ"


def test_extract_shorts_url():
    assert extract_video_id("https://www.youtube.com/shorts/dQw4w9WgXcQ") == "dQw4w9WgXcQ"


def test_extract_with_params():
    assert extract_video_id("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120") == "dQw4w9WgXcQ"


def test_extract_invalid_url():
    assert extract_video_id("https://example.com") is None


def test_extract_empty_string():
    assert extract_video_id("") is None


def test_is_valid_youtube_url():
    assert is_valid_youtube_url("https://www.youtube.com/watch?v=dQw4w9WgXcQ") is True
    assert is_valid_youtube_url("https://youtu.be/dQw4w9WgXcQ") is True
    assert is_valid_youtube_url("https://example.com") is False
    assert is_valid_youtube_url("") is False
