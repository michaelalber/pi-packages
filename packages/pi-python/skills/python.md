---
name: python
description: >
  Python 3, FastAPI, Flask, Pydantic v2, SQLAlchemy, pytest, and asyncio development.
  Use when working on Python projects, APIs, data models, async code, or database access.
---

# python

Use this skill when working on Python 3, FastAPI, Flask, Pydantic, SQLAlchemy, pytest, or asyncio projects.

## Before writing any code
1. Call `search_knowledge("Python {pattern}", collection="python")` — FastAPI, Pydantic v2, pytest, Flask, asyncio
2. Call `search_knowledge("SQL {pattern}", collection="databases")` for any SQLAlchemy or raw SQL work
3. Call `search_knowledge("{pattern}", collection="patterns")` for CQRS, Clean Architecture, DDD questions
4. Call `search_code_examples("{pattern}", language="python")` for implementation examples
5. Use returned patterns — never invent library APIs or method signatures

## Invariants
- Target Python 3.10+ unless the project runtime constrains otherwise
- Type hints on all function signatures — no untyped `def`
- Prefer `pathlib.Path` over `os.path` for filesystem operations
- Use `async def` / `asyncio` for I/O-bound work; `ProcessPoolExecutor` for CPU-bound
- Manage dependencies with `pyproject.toml` — never `setup.py`
- Use Pydantic v2 for data validation and settings (`BaseModel`, `BaseSettings`)
- Use context managers for all resource lifecycles — file handles, HTTP sessions, DB connections
- Parameterized queries only — no f-string or %-format SQL under any circumstances
- Mark all generated blocks: `# <AI-Generated START>` ... `# <AI-Generated END>`

## Task approach
- Single function or class: generate directly
- Feature touching 2+ files: list steps → wait for confirmation → execute one file at a time
- Any uncertainty about a library API: `[CANNOT COMPLETE: <reason>]` — never guess

## Quality gates
- Cyclomatic complexity per function < 10
- pytest test file created before production file
- All public functions and classes have docstrings (one-line summary only)
- Code coverage target ≥ 80% for business logic, ≥ 95% for security-critical paths
- Ruff clean; mypy passes with `strict = true`

## FastAPI rules
- Define request/response models with Pydantic v2 `BaseModel` — never use `dict` at API boundaries
- Use dependency injection (`Depends`) for DB sessions, auth, and settings
- Use `async def` route handlers for all I/O — never block the event loop with sync calls
- Return typed responses; set `response_model=` on every router decorator

## SQLAlchemy rules
- Use `async` session (`AsyncSession`) for all DB work in async contexts
- Never call `session.commit()` inside a loop
- Use `select()` expressions — never raw string SQL through the ORM
- Name Alembic migrations descriptively: `add_user_email_index`, not `revision_001`

## Output format
- Code only in fenced code blocks
- One file per block, filename as the block label
- pytest test file before production file
- Never output preamble or trailing summaries

## grounded-code collections for this project type
| Collection | Use for |
|---|---|
| `python` | Python 3.13, FastAPI, FastMCP, Pydantic v2, pytest, Flask, cosmicpython |
| `databases` | SQL, PostgreSQL indexing, relational theory, SQLAlchemy patterns |
| `patterns` | CQRS, Clean Architecture, DDD, vertical slice, dependency injection |
| `internal` | XP practices, TDD, OWASP, engineering standards |
| `api_design` | REST API design guidelines (Zalando, Google AIP, Microsoft) |
