from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import os
load_dotenv()


app = FastAPI()

@app.get("/")
def Server_hello():
    return{
        "status": 200,
        "message": "Server is running"
    }

@app.get("/Teachtrack")
def Teachtrack():
    return{
        "status": 200,
        "message": "Teachtrack is running"
    }