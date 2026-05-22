from pathlib import Path

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException
)
from fastapi.responses import FileResponse

from app.services.file_service import (
    save_upload_file
)
from app.converters.ppt_pdf import (
    ppt_to_pdf
)
from app.utils.file_validation import (
    validate_extension,
    validate_file_size
)

router = APIRouter(
    prefix="/ppt",
    tags=["PowerPoint Conversion"]
)


@router.post("/ppt-to-pdf")
async def convert_ppt_to_pdf(
    file: UploadFile = File(...)
):

    validate_extension(
        file.filename,
        [".ppt", ".pptx"]
    )

    validate_file_size(file)

    try:
        input_path = await save_upload_file(file)

        output_path = ppt_to_pdf(
            input_path,
            "outputs"
        )

        output_filename = Path(
            output_path
        ).name

        return FileResponse(
            path=output_path,
            filename=output_filename,
            media_type="application/pdf"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )