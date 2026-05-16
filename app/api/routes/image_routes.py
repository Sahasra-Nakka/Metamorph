from pathlib import Path

from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse

from app.services.file_service import save_upload_file
from app.converters.image_pdf import jpg_to_pdf
from app.converters.image_pdf import pdf_to_jpg

router = APIRouter(prefix="/image", tags=["Image Conversion"])

@router.post("/jpg-to-pdf")
async def convert_jpg_to_pdf(file: UploadFile = File(...)):

    input_path = await save_upload_file(file)

    output_filename = Path(file.filename).stem + ".pdf"
    output_path = f"outputs/{output_filename}"

    jpg_to_pdf(input_path, output_path)

    return FileResponse(
        path=output_path,
        filename=output_filename,
        media_type="application/pdf"
    )

@router.post("/pdf-to-jpg")
async def convert_pdf_to_jpg(file: UploadFile = File(...)):

    input_path = await save_upload_file(file)

    output_files = pdf_to_jpg(input_path, "outputs")

    return {
        "message": "Conversion successful",
        "files": output_files
    }