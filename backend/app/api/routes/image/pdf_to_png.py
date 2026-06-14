import uuid
import fitz

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse

from app.services.file_service import save_upload_file
from app.converters.image_pdf import pdf_to_png
from app.utils.file_validation import validate_extension, validate_file_size

router = APIRouter()

@router.post("/pdf-to-png")
async def convert_pdf_to_png(file: UploadFile = File(...), page: int = 1):
    validate_extension(file.filename, [".pdf"])
    validate_file_size(file)
    try:
        input_path = await save_upload_file(file)
        with fitz.open(input_path) as pdf_document:
            total_pages = len(pdf_document)
        if page < 1 or page > total_pages:
            raise HTTPException(status_code=400, detail=f"Invalid page. PDF has {total_pages} pages.")
        output_filename = f"{uuid.uuid4()}_page_{page}.png"
        output_path = f"outputs/{output_filename}"
        pdf_to_png(input_path, page, output_path)
        return FileResponse(path=output_path, filename=output_filename, media_type="image/png")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))