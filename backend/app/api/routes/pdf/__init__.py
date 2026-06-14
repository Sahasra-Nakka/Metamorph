from fastapi import APIRouter

from .merge_pdf import router as merge_pdf_router
from .split_pdf import router as split_pdf_router
from .page_count import router as page_count_router

router = APIRouter(prefix="/pdf", tags=["PDF Tools"])

router.include_router(merge_pdf_router)
router.include_router(split_pdf_router)
router.include_router(page_count_router)