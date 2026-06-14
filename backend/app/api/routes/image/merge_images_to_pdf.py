import uuid

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse

from app.services.file_service import save_upload_file
from app.converters.image_pdf import merge_images_to_pdf
from app.utils.file_validation import validate_file_size, validate_multiple_extensions

router = APIRouter()

@router.post("/merge-to-pdf")
async def merge_images_to_pdf_endpoint(files: list[UploadFile] = File(...)):
    validate_multiple_extensions(files, [".jpg", ".jpeg", ".png"])
    for file in files:
        validate_file_size(file)
    try:
        saved_paths = []
        for file in files:
            path = await save_upload_file(file)
            saved_paths.append(path)
        output_filename = f"merged_images_{uuid.uuid4()}.pdf"
        output_path = f"outputs/{output_filename}"
        merge_images_to_pdf(saved_paths, output_path)
        return FileResponse(path=output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))