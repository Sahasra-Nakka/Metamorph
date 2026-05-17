import os
from pathlib import Path

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"


os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


async def save_upload_file(upload_file):
    file_path = Path(UPLOAD_DIR) / upload_file.filename

    with open(file_path, "wb") as buffer:
        buffer.write(await upload_file.read())

    return str(file_path)