import os
import logging
from dotenv import load_dotenv
from anthropic import Anthropic, APIError, APITimeoutError, RateLimitError

load_dotenv()

logger = logging.getLogger(__name__)

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

MODEL = "claude-sonnet-4-5"


def ask_llm(question: str, system_prompt: str = "You are a helpful assistant.") -> str:
    """Send a single question to the LLM and return its text response."""
    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=1024,
            system=system_prompt,
            messages=[
                {"role": "user", "content": question}
            ],
        )
        return response.content[0].text

    except RateLimitError:
        logger.warning("Anthropic API rate limit hit")
        raise RuntimeError("The AI service is currently busy. Please try again shortly.")

    except APITimeoutError:
        logger.warning("Anthropic API request timed out")
        raise RuntimeError("The AI service took too long to respond. Please try again.")

    except APIError as e:
        logger.error(f"Anthropic API error: {e}")
        raise RuntimeError("The AI service encountered an error. Please try again later.")

def answer_with_context(question: str, retrieved_chunks: list) -> dict:
    """Generate an answer grounded in retrieved document chunks, with citations."""
    if not retrieved_chunks:
        return {
            "answer": "I don't have any relevant document content to answer this question.",
            "sources": [],
        }

    context_blocks = []
    for i, chunk in enumerate(retrieved_chunks):
        context_blocks.append(f"[Source {i+1}]\n{chunk.page_content}")
    context_text = "\n\n".join(context_blocks)

    system_prompt = (
        "You are a financial document assistant. Answer the user's question using ONLY "
        "the provided context below. If the context doesn't contain enough information "
        "to answer confidently, say so explicitly rather than guessing. "
        "Reference which source(s) you used, like [Source 1], in your answer."
    )

    prompt = f"Context:\n{context_text}\n\nQuestion: {question}"

    answer_text = ask_llm(prompt, system_prompt=system_prompt)

    sources = [
        {
            "chunk_index": chunk.metadata.get("chunk_index"),
            "document_id": chunk.metadata.get("document_id"),
            "text_preview": chunk.page_content[:150],
        }
        for chunk in retrieved_chunks
    ]

    return {"answer": answer_text, "sources": sources}