from fastapi import APIRouter

from .pdf_to_word import router as pdf_to_word_router
from .word_to_pdf import router as word_to_pdf_router

router = APIRouter(prefix="/word", tags=["Word Conversion"])

router.include_router(word_to_pdf_router)
router.include_router(pdf_to_word_router)
