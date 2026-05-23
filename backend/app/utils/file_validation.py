from pathlib import Path

from fastapi import HTTPException
import magic

MAX_FILE_SIZE = 50 * 1024 * 1024   # 50 MB

MIME_EXTENSION_MAP = {
    ".pdf": ["application/pdf"],
    ".doc": ["application/msword"],
    ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    ".ppt": ["application/vnd.ms-powerpoint"],
    ".pptx": ["application/vnd.openxmlformats-officedocument.presentationml.presentation"],
    ".xls": ["application/vnd.ms-excel"],
    ".xlsx": ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
    ".jpg": ["image/jpeg"],
    ".jpeg": ["image/jpeg"],
}


def validate_file_size(file):

    if file.size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="File too large. Max size is 50MB."
        )


def validate_extension(
    filename: str,
    allowed_extensions: list
):

    extension = (
        Path(filename).suffix.lower()
    )

    if extension not in allowed_extensions:

        allowed = ", ".join(
            allowed_extensions
        )

        raise HTTPException(
            status_code=400,
            detail=(
                f"Only {allowed} files are allowed"
            )
        )


async def validate_mime_type(
    file,
    allowed_extensions: list
):
    contents = await file.read(2048)
    await file.seek(0)

    mime = magic.from_buffer(
        contents,
        mime=True
    )

    allowed_mimes = []
    for ext in allowed_extensions:
        allowed_mimes.extend(
            MIME_EXTENSION_MAP.get(ext, [])
        )

    if mime not in allowed_mimes:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Detected: {mime}"
        )


def validate_multiple_extensions(
    files,
    allowed_extensions: list
):

    for file in files:

        validate_extension(
            file.filename,
            allowed_extensions
        )