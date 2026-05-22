from fastapi import FastAPI
import os

from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.image_routes import router as image_router
from app.api.routes.word_routes import router as word_router
from app.api.routes.ppt_routes import router as ppt_router
from app.api.routes.excel_routes import router as excel_router
from app.api.routes.pdf_routes import router as pdf_router
from app.services.cleanup_service import (
    start_cleanup_service
)

from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    start_cleanup_service()
    yield

app = FastAPI(
    title="Metamorph",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("FRONTEND_URL", "http://localhost:5173")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(image_router)
app.include_router(word_router)
app.include_router(pdf_router)
app.include_router(ppt_router)
app.include_router(excel_router)


@app.get("/")
def home():
    return {"message": "Metamorph API Running"}

