"""Optional Oxylabs residential proxy configuration."""

import os


def get_proxy_config() -> dict[str, str] | None:
    """Get proxy configuration for youtube-transcript-api.

    Returns proxy dict if Oxylabs credentials are configured,
    None for direct connection.
    """
    username = os.getenv("OXYLABS_RESIDENTIAL_USERNAME")
    password = os.getenv("OXYLABS_RESIDENTIAL_PASSWORD")
    endpoint = os.getenv("OXYLABS_RESIDENTIAL_ENDPOINT", "pr.oxylabs.io:7777")

    if username and password:
        proxy_url = f"http://{username}:{password}@{endpoint}"
        return {"http": proxy_url, "https": proxy_url}

    return None
