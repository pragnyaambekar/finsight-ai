# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repository is in initial setup — `backend/` and `frontend/` currently exist as empty
placeholder directories with no code, no commits, and no tooling configured yet. There are no
build/lint/test commands to run until the projects below are scaffolded. When scaffolding either
side, follow the intended stack below rather than introducing a different framework or package
manager.

## What this is

FinSight AI is a RAG-based financial document Q&A system. Users upload financial documents
(PDFs); the backend extracts and chunks the text, embeds it, and stores the embeddings in a
vector database. User questions are answered via retrieval + an LLM, with responses citing the
source passages they were grounded in.

Planned later phases (not yet started): an agent layer with tool-calling, and an MCP server.

## Intended architecture

- `backend/` — Python 3.11, FastAPI, LangChain, Chroma (vector DB), pytest for testing.
  Expected responsibilities: document ingestion/chunking, embedding + Chroma storage, the
  retrieval-augmented Q&A endpoint(s), and source citation in responses.
- `frontend/` — React, TypeScript, Vite. Expected responsibilities: document upload UI and the
  Q&A chat interface against the backend API.

The RAG pipeline (ingest → chunk → embed → store in Chroma → retrieve → generate with citations)
is the core data flow to keep in mind when adding backend features — new document types or
retrieval strategies should fit into this pipeline rather than bypassing it.
