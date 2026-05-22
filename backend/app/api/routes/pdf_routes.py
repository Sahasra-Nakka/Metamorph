import uuid
import fitz

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException
)
from fastapi.responses import FileResponse

from app.services.file_service import save_upload_file

from app.converters.pdf_tools import (
    split_pdf,
    merge_pdfs
)

from app.utils.file_validation import (
    validate_extension,
    validate_multiple_extensions,
    validate_file_size
)

router = APIRouter(
    prefix="/pdf",
    tags=["PDF Tools"]
)


@router.post(
    "/merge",
    summary="Merge PDFs",
    description="Upload multiple PDF files and merge them into one PDF"
)
async def merge_pdf_files(
    files: list[UploadFile] = File(...)
):

    validate_multiple_extensions(
        files,
        [".pdf"]
    )

    for file in files:
        validate_file_size(file)

    try:
        saved_files = []

        for file in files:
            unique_name = (
                f"{uuid.uuid4()}_{file.filename}"
            )

            file_path = (
                f"uploads/{unique_name}"
            )

            with open(
                file_path,
                "wb"
            ) as buffer:
                buffer.write(
                    await file.read()
                )

            saved_files.append(
                file_path
            )

        output_filename = (
            f"merged_{uuid.uuid4()}.pdf"
        )

        output_path = (
            f"outputs/{output_filename}"
        )

        merge_pdfs(
            saved_files,
            output_path
        )

        return FileResponse(
            path=output_path,
            filename=output_filename,
            media_type="application/pdf"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.post("/split")
async def split_pdf_file(
    file: UploadFile = File(...),
    pages: str = ""
):
    validate_extension(
        file.filename,
        [".pdf"]
    )

    validate_file_size(file)

    try:
        unique_name = (
            f"{uuid.uuid4()}_{file.filename}"
        )

        input_path = (
            f"uploads/{unique_name}"
        )

        with open(
            input_path,
            "wb"
        ) as buffer:
            buffer.write(
                await file.read()
            )

        output_filename = (
            f"split_{uuid.uuid4()}.pdf"
        )

        output_path = (
            f"outputs/{output_filename}"
        )

        split_pdf(
            input_path,
            pages,
            output_path
        )

        return FileResponse(
            path=output_path,
            filename=output_filename,
            media_type="application/pdf"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.post("/page-count")
async def get_pdf_page_count(
    file: UploadFile = File(...)
):
    validate_extension(
        file.filename,
        [".pdf"]
    )

    validate_file_size(file)

    try:
        input_path = await save_upload_file(file)

        pdf = fitz.open(input_path)

        return {
            "pages": len(pdf)
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )