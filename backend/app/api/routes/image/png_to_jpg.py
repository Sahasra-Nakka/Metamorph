import uuid

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

from app.converters.image_pdf import png_to_jpg
from app.services.file_service import save_upload_file
from app.utils.file_validation import validate_extension, validate_file_size

router = APIRouter()


@router.post("/png-to-jpg")
async def convert_png_to_jpg(file: UploadFile = File(...)):
    validate_extension(file.filename, [".png"])
    validate_file_size(file)
    try:
        input_path = await save_upload_file(file)
        output_filename = f"{uuid.uuid4()}.jpg"
        output_path = f"outputs/{output_filename}"
        png_to_jpg(input_path, output_path)
        return FileResponse(path=output_path, filename=output_filename, media_type="image/jpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
