from functools import lru_cache

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
CHROMA_PERSIST_DIR = "storage/chroma"


@lru_cache(maxsize=1)
def get_vector_store() -> Chroma:
    embedding_model = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL_NAME)
    return Chroma(
        collection_name="financial_documents",
        embedding_function=embedding_model,
        persist_directory=CHROMA_PERSIST_DIR,
    )


def add_document_chunks(document_id: str, chunks: list[str]) -> None:
    """Embed and store chunks for a given document, tagged with its document_id."""
    metadatas = [{"document_id": document_id, "chunk_index": i} for i in range(len(chunks))]
    ids = [f"{document_id}_{i}" for i in range(len(chunks))]
    get_vector_store().add_texts(texts=chunks, metadatas=metadatas, ids=ids)


def search_similar_chunks(query: str, k: int = 3):
    """Return the k most relevant chunks for a given query."""
    return get_vector_store().similarity_search(query, k=k)

def get_retriever(k: int = 3):
    """Return a LangChain retriever backed by the Chroma vector store."""
    return get_vector_store().as_retriever(search_kwargs={"k": k})