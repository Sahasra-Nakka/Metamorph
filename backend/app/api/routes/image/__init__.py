from fastapi import APIRouter

from .jpg_to_pdf import router as jpg_to_pdf_router
from .jpg_to_png import router as jpg_to_png_router
from .merge_images_to_pdf import router as merge_images_router
from .pdf_to_jpg import router as pdf_to_jpg_router
from .pdf_to_png import router as pdf_to_png_router
from .png_to_jpg import router as png_to_jpg_router
from .png_to_pdf import router as png_to_pdf_router

router = APIRouter(prefix="/image", tags=["Image Conversion"])

router.include_router(jpg_to_pdf_router)
router.include_router(pdf_to_jpg_router)
router.include_router(pdf_to_png_router)
router.include_router(png_to_pdf_router)
router.include_router(png_to_jpg_router)
router.include_router(jpg_to_png_router)
router.include_router(merge_images_router)
