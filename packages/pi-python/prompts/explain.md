# Explain (Python)

Explain the Python code below to a developer who is new to this codebase.

## Rules
- Focus on WHY, not WHAT — the code itself shows what it does
- Call out async gotchas: blocking calls inside `async def`, event loop constraints, `asyncio.run` misuse
- Note Pydantic v2 behavior changes from v1: `model_dump()` vs `dict()`, validators, `model_config`
- Identify FastAPI dependency injection lifetimes if `Depends` is present — scope matters
- Note SQLAlchemy session lifecycle if present — when sessions open, flush, commit, and close
- Keep it under 200 words unless the code is genuinely complex

## Code to explain
{code_context}
