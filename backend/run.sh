#!/bin/bash
uvicorn main:app --reload --reload-exclude "**/venv/**" --reload-exclude "**/storage/**"
