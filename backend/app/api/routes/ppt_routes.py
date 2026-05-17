from pathlib import Path

from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse

from app.services.file_service import save_upload_file
from app.converters.ppt_pdf import ppt_to_pdf

router = APIRouter(
    prefix="/ppt",
    tags=["PowerPoint Conversion"]
)


@router.post(
    "/ppt-to-pdf",
    summary="Convert PPTX to PDF",
    description="Upload a PowerPoint file and convert it to PDF"
)
async def convert_ppt_to_pdf(file: UploadFile = File(...)):

    try:

        input_path = await save_upload_file(file)

        ppt_to_pdf(input_path)

        output_filename = Path(file.filename).stem + ".pdf"

        output_path = f"outputs/{output_filename}"

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