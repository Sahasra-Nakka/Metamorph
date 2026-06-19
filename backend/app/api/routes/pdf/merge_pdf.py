import uuid

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

from app.converters.pdf_tools import merge_pdfs
from app.services.file_service import save_upload_file
from app.utils.file_validation import validate_file_size, validate_multiple_extensions

router = APIRouter()


@router.post("/merge")
async def merge_pdf_files(files: list[UploadFile] = File(...)):
    validate_multiple_extensions(files, [".pdf"])
    for file in files:
        validate_file_size(file)
    try:
        saved_files = []
        for file in files:
            file_path = await save_upload_file(file)
            saved_files.append(file_path)
        output_filename = f"merged_{uuid.uuid4()}.pdf"
        output_path = f"outputs/{output_filename}"
        merge_pdfs(saved_files, output_path)
        return FileResponse(
            path=output_path, filename=output_filename, media_type="application/pdf"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
