from pathlib import Path

from fastapi import HTTPException

MAX_FILE_SIZE = 50 * 1024 * 1024   # 50 MB


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


def validate_multiple_extensions(
    files,
    allowed_extensions: list
):

    for file in files:

        validate_extension(
            file.filename,
            allowed_extensions
        )