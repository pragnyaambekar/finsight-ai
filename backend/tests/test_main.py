from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_upload_rejects_non_pdf_file():
    fake_file = ("test.txt", b"this is not a pdf", "text/plain")

    response = client.post(
        "/documents/upload",
        files={"file": fake_file},
    )

    assert response.status_code == 400
    assert "Invalid file type" in response.json()["detail"]