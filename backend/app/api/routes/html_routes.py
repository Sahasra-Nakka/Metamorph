from pathlib import Path

from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse

from app.services.file_service import save_upload_file
from app.converters.html_pdf import html_to_pdf

router = APIRouter(prefix="/html", tags=["HTML Conversion"])

@router.post("/html-to-pdf")
async def convert_html_to_pdf(file: UploadFile = File(...)):

    input_path = await save_upload_file(file)

    output_filename = Path(file.filename).stem + ".pdf"
    output_path = f"outputs/{output_filename}"

    html_to_pdf(input_path, output_path)

    return FileResponse(
        path=output_path,
        filename=output_filename,
        media_type="application/pdf"
    )