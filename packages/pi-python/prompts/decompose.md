# Decompose (Python)

Break the Python feature below into atomic steps before executing.

## Rules
1. List numbered steps — one sentence each, one file per step
2. Start each production file step with its corresponding pytest test file step
3. Mark steps that touch Alembic migrations — these run separately and need DB coordination
4. Mark steps that modify `pyproject.toml` dependencies — flag new packages for security review
5. Mark steps that change public API contracts (FastAPI routes, Pydantic models) — check for downstream consumers first
6. Stop after the list — wait for confirmation before executing

## Task
{user_request}
