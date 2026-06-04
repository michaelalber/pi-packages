# Fix (PHP / Laravel)

Fix the bug described below.

## Rules
1. Read the failing code — understand the root cause before writing anything
2. Call `search_knowledge("Laravel {pattern}", collection="php")` for library or API questions
3. Write the minimal change that fixes the bug — no refactoring, no unrelated cleanup
4. Never introduce raw string-concatenated SQL — fix query issues with Eloquent or bound parameters
5. Add or update the Pest test that would have caught this bug
6. Mark all generated code: `# <AI-Generated START>` ... `# <AI-Generated END>`

## Task
{user_request}

## Relevant code
{code_context}
