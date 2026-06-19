from fastapi import APIRouter

from .excel_to_pdf import router as excel_to_pdf_router

router = APIRouter(prefix="/excel", tags=["Excel Conversion"])

router.include_router(excel_to_pdf_router)
