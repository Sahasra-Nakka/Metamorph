import os
import uuid

from pathlib import Path

from fastapi import HTTPException


UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"


os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


async def save_upload_file(upload_file):

    safe_filename = Path(
        upload_file.filename
    ).name

    if not safe_filename:
        raise HTTPException(
            status_code=400,
            detail="Invalid filename"
        )

    unique_name = (
        f"{uuid.uuid4()}_"
        f"{safe_filename}"
    )

    file_path = (
        Path(UPLOAD_DIR) / unique_name
    )

    with open(file_path, "wb") as buffer:
        buffer.write(
            await upload_file.read()
        )

    return str(file_path)