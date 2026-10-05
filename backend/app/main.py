from fastapi import FastAPI

app = FastAPI()


@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/")
def home():
    return {"message": "Welcome to the Python Code Visualizer API!"}