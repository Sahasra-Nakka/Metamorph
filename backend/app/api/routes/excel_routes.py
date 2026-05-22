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
from app.converters.excel_pdf import (
    excel_to_pdf
)
from app.utils.file_validation import (
    validate_extension,
    validate_file_size
)

router = APIRouter(
    prefix="/excel",
    tags=["Excel Conversion"]
)


@router.post("/excel-to-pdf")
async def convert_excel_to_pdf(
    file: UploadFile = File(...)
):

    validate_extension(
        file.filename,
        [".xlsx", ".xls"]
    )

    validate_file_size(file)

    try:
        input_path = await save_upload_file(file)

        output_path = excel_to_pdf(
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