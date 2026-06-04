# Generate (Python)

Generate the Python code described below.

## Before writing
1. Call `search_knowledge("Python {pattern}", collection="python")`
2. Call `search_knowledge("SQL {pattern}", collection="databases")` for SQLAlchemy / SQL work
3. Call `search_code_examples("{pattern}", language="python")`
4. Read the provided existing code — match conventions exactly

## Rules
- pytest test file first, then production file
- One file per fenced code block, filename as the block label
- Target Python 3.10+; type hints on all signatures
- `async def` / `await` for all I/O; never block the event loop
- Pydantic v2 `BaseModel` at all API / data boundaries — no bare `dict`
- Parameterized queries only — never f-string or %-format SQL
- Use `pathlib.Path` for filesystem operations
- Mark all generated code: `# <AI-Generated START>` ... `# <AI-Generated END>`
- If uncertain about a library API: `[CANNOT COMPLETE: <reason>]`

## Existing code context
{code_context}

## Task
{user_request}
