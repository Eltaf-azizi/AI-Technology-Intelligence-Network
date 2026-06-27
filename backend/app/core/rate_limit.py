import os
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.config import settings

if os.getenv("ATIN_TESTING"):
    limiter = Limiter(key_func=get_remote_address, default_limits=["10000/minute"])
else:
    limiter = Limiter(key_func=get_remote_address, default_limits=[f"{settings.RATE_LIMIT_REQUESTS}/{settings.RATE_LIMIT_WINDOW_SECONDS}seconds"])
