# Fix (Python)

Fix the bug described below.

## Rules
1. Read the failing code — understand the root cause before writing anything
2. Call `search_knowledge("Python {pattern}", collection="python")` for library or API questions
3. Write the minimal change that fixes the bug — no refactoring, no unrelated cleanup
4. Never introduce blocking I/O in async functions — fix async issues properly with `await`
5. Add or update the pytest test that would have caught this bug
6. Mark all generated code: `# <AI-Generated START>` ... `# <AI-Generated END>`

## Task
{user_request}

## Relevant code
{code_context}
