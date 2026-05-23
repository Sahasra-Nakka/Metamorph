import os
import time
import threading
import shutil
import logging

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

            for entry in os.listdir(folder):

                path = os.path.join(
                    folder,
                    entry
                )

                age = (
                    now -
                    os.path.getmtime(path)
                )

                if age < MAX_AGE:
                    continue

                try:
                    if os.path.isfile(path):
                        os.remove(path)
                        logger.info(
                            f"Deleted file: {path}"
                        )
                    elif os.path.isdir(path):
                        shutil.rmtree(path)
                        logger.info(
                            f"Deleted directory: {path}"
                        )
                except Exception as e:
                    logger.error(
                        f"Failed to delete {path}: {e}"
                    )

        time.sleep(30)


def start_cleanup_service():

    thread = threading.Thread(
        target=cleanup_loop,
        daemon=True
    )

    thread.start()