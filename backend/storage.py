import os
from pathlib import Path

UPLOAD_DIR = Path("storage/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def save_file(document_id: str, contents: bytes) -> str:
    """Save file bytes to local disk, keyed by document_id. Returns the file path."""
    file_path = UPLOAD_DIR / f"{document_id}.pdf"
    with open(file_path, "wb") as f:
        f.write(contents)
    return str(file_path)


def get_file_path(document_id: str) -> str | None:
    """Return the path to a stored document, or None if it doesn't exist."""
    file_path = UPLOAD_DIR / f"{document_id}.pdf"
    return str(file_path) if file_path.exists() else None