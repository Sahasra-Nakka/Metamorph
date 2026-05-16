from pathlib import Path

from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse

from app.converters.pdf_word import pdf_to_docx
from app.services.file_service import save_upload_file
from app.converters.word_pdf import word_to_pdf


router = APIRouter(prefix="/word", tags=["Word Conversion"])

@router.post("/word-to-pdf",summary="Convert Word to PDF",
    description="Upload a DOCX file and convert it to PDF")
async def convert_word_to_pdf(file: UploadFile = File(...)):

    input_path = await save_upload_file(file)

    word_to_pdf(input_path)

    output_filename = Path(file.filename).stem + ".pdf"
    output_path = f"outputs/{output_filename}"

    return FileResponse(
        path=output_path,
        filename=output_filename,
        media_type="application/pdf"
    )

@router.post(
    "/pdf-to-word",
    summary="Convert PDF to Word",
    description="Upload a PDF file and convert it to DOCX"
)
async def convert_pdf_to_word(file: UploadFile = File(...)):

    try:

        input_path = await save_upload_file(file)

        output_filename = Path(file.filename).stem + ".docx"

        output_path = f"outputs/{output_filename}"

        pdf_to_docx(input_path, output_path)

        return FileResponse(
            path=output_path,
            filename=output_filename,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
