from document_processor import chunk_text


def test_chunk_text_splits_long_text():
    long_text = "This is a sentence. " * 200
    chunks = chunk_text(long_text, chunk_size=1000, chunk_overlap=200)

    assert len(chunks) > 1
    for chunk in chunks:
        assert len(chunk) <= 1000


def test_chunk_text_handles_short_text():
    short_text = "Just one short sentence."
    chunks = chunk_text(short_text, chunk_size=1000, chunk_overlap=200)

    assert len(chunks) == 1
    assert chunks[0] == short_text


def test_chunk_text_handles_empty_string():
    chunks = chunk_text("", chunk_size=1000, chunk_overlap=200)

    assert chunks == []