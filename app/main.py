from fastapi import FastAPI

from app.api.routes.image_routes import router as image_router
from app.api.routes.word_routes import router as word_router
from app.api.routes.ppt_routes import router as ppt_router
from app.api.routes.excel_routes import router as excel_router
#from app.api.routes.html_routes import router as html_router

app = FastAPI(title="Metamorph")

app.include_router(image_router)
app.include_router(word_router)
app.include_router(ppt_router)
app.include_router(excel_router)
#app.include_router(html_router)


@app.get("/")
def home():
    return {"message": "Metamorph API Running"}