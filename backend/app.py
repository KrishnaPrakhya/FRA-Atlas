from fastapi import FastAPI
from .ocr import app as ocr_app

app = FastAPI()

app.mount("/ocr", ocr_app)

@app.get("/")
def read_root():
    return {"message": "Welcome to the FRA-Atlas API"}

