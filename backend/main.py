import uuid
from fastapi import FastAPI, UploadFile, HTTPException
from storage import save_file

app = FastAPI(title="FinSight AI", version="0.1.0") 

ALLOWED_CONTENT_TYPE = "application/pdf"
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10MB

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/")
async def root():
    return { "message": "Hello from Prag"}

@app.post("/documents/upload")
async def upload_document(file: UploadFile):
    # 1. Validate file type
    if file.content_type != ALLOWED_CONTENT_TYPE:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.content_type}. Only PDF files are accepted.",
        )

    # 2. Read the file contents (needed to check size and later to process it)
    contents = await file.read()

    # 3. Validate file size
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"File too large: {len(contents)} bytes. Max allowed is {MAX_FILE_SIZE_BYTES} bytes.",
        )

    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # 4. Generate a unique document ID
    document_id = str(uuid.uuid4())
    save_file(document_id, contents)

    # 5. Return metadata
    return {
        "document_id": document_id,
        "filename": file.filename,
        "size_bytes": len(contents),
        "status": "uploaded",
    }