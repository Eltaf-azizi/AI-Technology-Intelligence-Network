import logging
import sys

logger = logging.getLogger("atin")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.INFO)
formatter = logging.Formatter("%(asctime)s | %(levelname)-8s | %(message)s", datefmt="%Y-%m-%d %H:%M:%S")
handler.setFormatter(formatter)
if not logger.handlers:
    logger.addHandler(handler)
