from mcp.server.mcpserver import MCPServer

from vector_store import search_similar_chunks, get_full_document_text, list_documents

mcp = MCPServer("FinSight Financial Tools")


@mcp.tool()
def search_documents(query: str) -> str:
    """
    Search for specific, targeted information across uploaded financial documents.
    Best for finding a specific transaction, charge, or fact.
    """
    results = search_similar_chunks(query, k=3)
    return "\n\n".join(doc.page_content for doc in results)


@mcp.tool()
def get_full_document(document_id: str) -> str:
    """
    Retrieve the complete, full text of a specific document by its document_id.
    Use this when a question requires an exhaustive answer, such as totals or sums.
    """
    return get_full_document_text(document_id)


@mcp.tool()
def list_available_documents() -> str:
    """
    List the document_ids of all documents currently available.
    """
    docs = list_documents()
    return "\n".join(docs) if docs else "No documents have been uploaded yet."


if __name__ == "__main__":
    mcp.run()