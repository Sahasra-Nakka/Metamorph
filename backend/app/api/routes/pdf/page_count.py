import fitz
from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.file_service import save_upload_file
from app.utils.file_validation import validate_extension, validate_file_size

router = APIRouter()


@router.post("/page-count")
async def get_pdf_page_count(file: UploadFile = File(...)):
    validate_extension(file.filename, [".pdf"])
    validate_file_size(file)
    try:
        input_path = await save_upload_file(file)
        with fitz.open(input_path) as pdf:
            return {"pages": len(pdf)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
