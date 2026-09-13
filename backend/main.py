import uuid
from fastapi import FastAPI, UploadFile, HTTPException
from storage import save_file
from pydantic import BaseModel
from llm_client import ask_llm
from vector_store import search_similar_chunks, add_document_chunks
from llm_client import answer_with_context
from document_processor import extract_text_from_pdf, chunk_text




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

        # 4. Generate a unique document ID and save the file
    document_id = str(uuid.uuid4())
    file_path = save_file(document_id, contents)

    # 5. Process the document: extract text, chunk it, and store embeddings
    try:
        text = extract_text_from_pdf(file_path)
        chunks = chunk_text(text)
        add_document_chunks(document_id, chunks)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"File was saved but processing failed: {str(e)}",
        )

    # 6. Return metadata
    return {
        "document_id": document_id,
        "filename": file.filename,
        "size_bytes": len(contents),
        "chunks_created": len(chunks),
        "status": "processed",
    }
class QuestionRequest(BaseModel):
    question: str

@app.post("/ask")
async def ask(request: QuestionRequest):
    try:
        answer = ask_llm(request.question)
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))

    return {"question": request.question, "answer": answer}

class RagQuestionRequest(BaseModel):
    question: str

@app.post("/documents/ask")
async def ask_document_question(request: RagQuestionRequest):
    retrieved_chunks = search_similar_chunks(request.question, k=3)
    result = answer_with_context(request.question, retrieved_chunks)
    return result