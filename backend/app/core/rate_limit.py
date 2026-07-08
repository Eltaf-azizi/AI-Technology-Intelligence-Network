import os
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.config import settings

_is_testing = os.getenv("ATIN_TESTING") == "1"

if _is_testing:
    limiter = Limiter(key_func=get_remote_address, default_limits=["100000/hour"])
else:
    limiter = Limiter(
        key_func=get_remote_address,
        default_limits=[f"{settings.RATE_LIMIT_REQUESTS}/{settings.RATE_LIMIT_WINDOW_SECONDS}seconds"],
    )


def limit(limit_str: str):
    """Conditional rate limit decorator - no-op during testing."""
    if _is_testing:
        def noop(func):
            return func
        return noop
    return limiter.limit(limit_str)
