from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough, RunnableParallel
from langchain_anthropic import ChatAnthropic

from vector_store import get_retriever
from prompts import rag_prompt
from llm_client import MODEL


def format_docs(docs):
    """Turn a list of retrieved chunks into one readable text block."""
    return "\n\n".join(
        f"[Source {i+1}]\n{doc.page_content}" for i, doc in enumerate(docs)
    )


llm = ChatAnthropic(model=MODEL, max_tokens=1024)
retriever = get_retriever(k=3)

# Step 1: retrieve chunks, keep them around, don't lose them
retrieve_step = RunnableParallel(
    docs=retriever,
    question=RunnablePassthrough(),
)

# Step 2: build the answer using those chunks
generate_step = RunnableParallel(
    answer=(
        {"context": lambda x: format_docs(x["docs"]), "question": lambda x: x["question"]}
        | rag_prompt
        | llm
        | StrOutputParser()
    ),
    sources=lambda x: [
        {
            "chunk_index": doc.metadata.get("chunk_index"),
            "document_id": doc.metadata.get("document_id"),
            "text_preview": doc.page_content[:150],
        }
        for doc in x["docs"]
    ],
)

rag_chain = retrieve_step | generate_step