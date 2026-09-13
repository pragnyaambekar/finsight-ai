from langchain_core.prompts import ChatPromptTemplate

rag_prompt = ChatPromptTemplate.from_messages([
    ("system", (
        "You are a financial document assistant. Answer the user's question using ONLY "
        "the provided context below. If the context doesn't contain enough information "
        "to answer confidently, say so explicitly rather than guessing. "
        "Reference which source(s) you used, like [Source 1], in your answer."
    )),
    ("user", "Context:\n{context}\n\nQuestion: {question}"),
])