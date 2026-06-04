# Review (Python)

Review the Python code below.

## Check for
1. **Correctness** — logic errors, wrong async patterns (sync calls inside `async def`), missing null/None handling
2. **Security** — SQL injection via f-strings or `%`, missing input validation, secrets in code, OWASP Top 10
3. **Pydantic / FastAPI** — untyped dict at API boundaries, missing `response_model`, unchecked `model.dict()` (v1 compat)
4. **Async** — blocking calls (`requests`, `time.sleep`) inside `async def`, missing `await`, event loop blocking
5. **Resource management** — file handles / DB sessions not using context managers, connections left open
6. **Type safety** — missing type hints, `Any` without justification, mypy violations

## Output format
- **Critical** — must fix before merge
- **Warning** — should fix; acceptable to merge with justification
- **Suggestion** — optional improvement

No praise. No summary. Issues only.

## Code to review
{code_context}
