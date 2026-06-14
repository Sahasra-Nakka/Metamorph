import uuid
import fitz

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException
)
from fastapi.responses import FileResponse

from app.services.file_service import save_upload_file
from app.converters.image_pdf import jpg_to_pdf, pdf_to_jpg, png_to_pdf, pdf_to_png, png_to_jpg, jpg_to_png
from app.utils.file_validation import (
    validate_extension,
    validate_file_size
)

router = APIRouter(
    prefix="/image",
    tags=["Image Conversion"]
)


@router.post("/jpg-to-pdf")
async def convert_jpg_to_pdf(
    file: UploadFile = File(...)
):
    validate_extension(file.filename, [".jpg", ".jpeg"])
    validate_file_size(file)

    try:
        input_path = await save_upload_file(file)
        output_filename = f"{uuid.uuid4()}.pdf"
        output_path = f"outputs/{output_filename}"
        jpg_to_pdf(input_path, output_path)
        return FileResponse(path=output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pdf-to-jpg")
async def convert_pdf_to_jpg(
    file: UploadFile = File(...),
    page: int = 1
):
    validate_extension(file.filename, [".pdf"])
    validate_file_size(file)

    try:
        input_path = await save_upload_file(file)
        pdf_document = fitz.open(input_path)

        if page < 1 or page > len(pdf_document):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid page. PDF has {len(pdf_document)} pages."
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


@router.post("/png-to-pdf")
async def convert_png_to_pdf(
    file: UploadFile = File(...)
):
    validate_extension(file.filename, [".png"])
    validate_file_size(file)

    try:
        input_path = await save_upload_file(file)
        output_filename = f"{uuid.uuid4()}.pdf"
        output_path = f"outputs/{output_filename}"
        png_to_pdf(input_path, output_path)
        return FileResponse(path=output_path, filename=output_filename, media_type="application/pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pdf-to-png")
async def convert_pdf_to_png(
    file: UploadFile = File(...),
    page: int = 1
):
    validate_extension(file.filename, [".pdf"])
    validate_file_size(file)

    try:
        input_path = await save_upload_file(file)
        pdf_document = fitz.open(input_path)

        if page < 1 or page > len(pdf_document):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid page. PDF has {len(pdf_document)} pages."
            )

        output_filename = f"{uuid.uuid4()}_page_{page}.png"
        output_path = f"outputs/{output_filename}"
        pdf_to_png(input_path, page, output_path)
        return FileResponse(path=output_path, filename=output_filename, media_type="image/png")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/png-to-jpg")
async def convert_png_to_jpg(
    file: UploadFile = File(...)
):
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


@router.post("/jpg-to-png")
async def convert_jpg_to_png(
    file: UploadFile = File(...)
):
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