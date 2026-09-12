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