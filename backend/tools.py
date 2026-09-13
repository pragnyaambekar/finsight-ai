from langchain_core.tools import tool
from vector_store import list_documents, search_similar_chunks, get_full_document_text


@tool
def search_documents(query: str) -> str:
    """
    Search for specific, targeted information across uploaded financial documents.
    Best for finding a specific transaction, charge, or fact.
    Not suitable for questions requiring a complete total or full list, since this
    only returns the most relevant few matches, not everything.
    """
    results = search_similar_chunks(query, k=3)
    return "\n\n".join(doc.page_content for doc in results)


@tool
def get_full_document(document_id: str) -> str:
    """
    Retrieve the complete, full text of a specific document by its document_id.
    Use this when a question requires an exhaustive answer, such as totals, sums,
    or "how many" questions, where missing even one transaction would give a wrong answer.
    """
    return get_full_document_text(document_id)

@tool
def list_available_documents() -> str:
    """
    List the document_ids of all documents currently available to search or retrieve.
    Use this first if you don't already know a specific document_id and need one
    to answer the question.
    """
    docs = list_documents()
    return "\n".join(docs) if docs else "No documents have been uploaded yet."

@tool
def calculate_sum(numbers: list[float]) -> float:
    """
    Add up a list of numbers and return the exact total.
    Use this whenever you need to sum multiple amounts, rather than adding them yourself,
    to guarantee the total is mathematically correct.
    """
    return sum(numbers)