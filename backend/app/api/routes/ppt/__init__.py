from fastapi import APIRouter

from .ppt_to_pdf import router as ppt_to_pdf_router

router = APIRouter(prefix="/ppt", tags=["PowerPoint Conversion"])

router.include_router(ppt_to_pdf_router)