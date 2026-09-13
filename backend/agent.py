from langchain.agents import create_agent
from langchain_anthropic import ChatAnthropic

from tools import calculate_sum, list_available_documents, search_documents, get_full_document
from llm_client import MODEL

llm = ChatAnthropic(model=MODEL, max_tokens=1024)

tools = [search_documents, get_full_document, list_available_documents, calculate_sum]


agent = create_agent(llm, tools)