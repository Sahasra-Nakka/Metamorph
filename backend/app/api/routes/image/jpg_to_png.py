import uuid

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

from app.converters.image_pdf import jpg_to_png
from app.services.file_service import save_upload_file
from app.utils.file_validation import validate_extension, validate_file_size

router = APIRouter()


@router.post("/jpg-to-png")
async def convert_jpg_to_png(file: UploadFile = File(...)):
    validate_extension(file.filename, [".jpg", ".jpeg"])
    validate_file_size(file)
    try:
        input_path = await save_upload_file(file)
        output_filename = f"{uuid.uuid4()}.png"
        output_path = f"outputs/{output_filename}"
        jpg_to_png(input_path, output_path)
        return FileResponse(path=output_path, filename=output_filename, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
