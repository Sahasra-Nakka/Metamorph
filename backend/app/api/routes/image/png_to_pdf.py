import uuid

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse

from app.services.file_service import save_upload_file
from app.converters.image_pdf import png_to_pdf
from app.utils.file_validation import validate_extension, validate_file_size

router = APIRouter()

@router.post("/png-to-pdf")
async def convert_png_to_pdf(file: UploadFile = File(...)):
    validate_extension(file.filename, [".png"])
    validate_file_size(file)
    try:
        input_path = await save_upload_file(file)
        output_filename = f"{uuid.uuid4()}.pdf"
        output_path = f"outputs/{output_filename}"
        png_to_pdf(input_path, output_path)
        return FileResponse(path=output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))