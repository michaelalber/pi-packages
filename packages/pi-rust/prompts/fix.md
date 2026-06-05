# Fix (Rust)

Fix the bug described below.

## Rules
1. Read the failing code — understand the root cause before writing anything
2. Call `search_knowledge("Rust {pattern}", collection="patterns")` for design or API questions
3. Write the minimal change that fixes the bug — no refactoring, no unrelated cleanup
4. Never introduce `unwrap()` or `expect()` — fix error-handling issues properly with `?`
5. If the fix touches `unsafe`, add or verify the `// SAFETY:` comment
6. Add or update the `#[test]` that would have caught this bug
7. Mark all generated code: `// <AI-Generated START>` ... `// <AI-Generated END>`

## Task
{user_request}

## Relevant code
{code_context}
