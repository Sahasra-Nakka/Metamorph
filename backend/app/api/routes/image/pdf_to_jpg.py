import uuid

import fitz
from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

from app.services.file_service import save_upload_file
from app.utils.file_validation import validate_extension, validate_file_size

router = APIRouter()


@router.post("/pdf-to-jpg")
async def convert_pdf_to_jpg(file: UploadFile = File(...), page: int = 1):
    validate_extension(file.filename, [".pdf"])
    validate_file_size(file)
    try:
        input_path = await save_upload_file(file)
        pdf_document = fitz.open(input_path)
        if page < 1 or page > len(pdf_document):
            raise HTTPException(
                status_code=400, detail=f"Invalid page. PDF has {len(pdf_document)} pages."
            )
        pdf_page = pdf_document.load_page(page - 1)
        pix = pdf_page.get_pixmap()
        output_filename = f"{uuid.uuid4()}_page_{page}.jpg"
        output_path = f"outputs/{output_filename}"
        pix.save(output_path)
        return FileResponse(path=output_path, filename=output_filename, media_type="image/jpeg")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
