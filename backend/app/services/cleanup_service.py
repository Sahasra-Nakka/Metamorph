import logging
import os
import shutil
import threading
import time

logger = logging.getLogger(__name__)

UPLOADS = "uploads"
OUTPUTS = "outputs"
MAX_AGE = 600


def cleanup_loop():
    while True:
        now = time.time()

        for folder in [UPLOADS, OUTPUTS]:
            if not os.path.exists(folder):
                continue

            with os.scandir(folder) as entries:
                for entry in entries:
                    try:
                        age = now - entry.stat().st_mtime
                    except OSError:
                        continue

                    if age < MAX_AGE:
                        continue

                    try:
                        if entry.is_file():
                            os.remove(entry.path)
                            logger.info(f"Deleted file: {entry.path}")
                        elif entry.is_dir():
                            shutil.rmtree(entry.path)
                            logger.info(f"Deleted directory: {entry.path}")
                    except Exception as e:
                        logger.error(f"Failed to delete {entry.path}: {e}")

        time.sleep(30)


def start_cleanup_service():
    thread = threading.Thread(target=cleanup_loop, daemon=True)
    thread.start()
