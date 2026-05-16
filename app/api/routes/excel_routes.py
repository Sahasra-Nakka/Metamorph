from pathlib import Path

from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse

from app.services.file_service import save_upload_file
from app.converters.excel_pdf import excel_to_pdf

router = APIRouter(prefix="/excel", tags=["Excel Conversion"])

@router.post("/excel-to-pdf")
async def convert_excel_to_pdf(file: UploadFile = File(...)):

    input_path = await save_upload_file(file)

    excel_to_pdf(input_path)

    output_filename = Path(file.filename).stem + ".pdf"
    output_path = f"outputs/{output_filename}"

    return FileResponse(
        path=output_path,
        filename=output_filename,
        media_type="application/pdf"
    )