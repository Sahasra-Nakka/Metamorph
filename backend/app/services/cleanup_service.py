import os
import time
import threading

UPLOADS = "uploads"
OUTPUTS = "outputs"
MAX_AGE = 300


def cleanup_loop():

    while True:

        now = time.time()

        for folder in [UPLOADS, OUTPUTS]:

            if not os.path.exists(folder):
                continue

            for filename in os.listdir(folder):

                path = os.path.join(
                    folder,
                    filename
                )

                if not os.path.isfile(path):
                    continue

                age = (
                    now -
                    os.path.getmtime(path)
                )

                if age > MAX_AGE:
                    try:
                        os.remove(path)
                    except Exception:
                        pass

        time.sleep(30)


def start_cleanup_service():

    thread = threading.Thread(
        target=cleanup_loop,
        daemon=True
    )

    thread.start()