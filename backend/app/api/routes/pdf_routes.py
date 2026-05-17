from pathlib import Path
import uuid

from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
from app.converters.pdf_tools import split_pdf
from app.converters.pdf_tools import merge_pdfs

router = APIRouter(
    prefix="/pdf",
    tags=["PDF Tools"]
)



@router.post(
    "/merge",
    summary="Merge PDFs",
    description="Upload multiple PDF files and merge them into one PDF"
)
async def merge_pdf_files(files: list[UploadFile] = File(...)):

    try:

        saved_files = []

        for file in files:

            unique_name = f"{uuid.uuid4()}_{file.filename}"

            file_path = f"uploads/{unique_name}"

            with open(file_path, "wb") as buffer:
                buffer.write(await file.read())

            saved_files.append(file_path)

        output_filename = f"merged_{uuid.uuid4()}.pdf"

        output_path = f"outputs/{output_filename}"

        merge_pdfs(saved_files, output_path)

        return FileResponse(
            path=output_path,
            filename=output_filename,
            media_type="application/pdf"
        )

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
    
@router.post(
    "/split",
    summary="Split PDF",
    description="Extract selected pages from a PDF"
)
async def split_pdf_file(
    file: UploadFile = File(...),
    start_page: int = 1,
    end_page: int = 1
):

    try:

        unique_name = f"{uuid.uuid4()}_{file.filename}"

        input_path = f"uploads/{unique_name}"

        with open(input_path, "wb") as buffer:
            buffer.write(await file.read())

        output_filename = f"split_{uuid.uuid4()}.pdf"

        output_path = f"outputs/{output_filename}"

        split_pdf(
            input_path,
            start_page,
            end_page,
            output_path
        )

        return FileResponse(
            path=output_path,
            filename=output_filename,
            media_type="application/pdf"
        )

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }