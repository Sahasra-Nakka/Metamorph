import uuid

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse

from app.services.file_service import save_upload_file
from app.converters.pdf_word import pdf_to_docx
from app.utils.file_validation import validate_extension, validate_file_size

router = APIRouter()

@router.post("/pdf-to-word")
async def convert_pdf_to_word(file: UploadFile = File(...)):
    validate_extension(file.filename, [".pdf"])
    validate_file_size(file)
    try:
        input_path = await save_upload_file(file)
        output_filename = f"{uuid.uuid4()}.docx"
        output_path = f"outputs/{output_filename}"
        pdf_to_docx(input_path, output_path)
        return FileResponse(
            path=output_path,
            filename=output_filename,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))