# Fix (Industrial)

Fix the bug described below.

## Rules
1. Read the failing code — understand the root cause before writing anything
2. Call `search_knowledge("{protocol}", collection="automation")` for MODBUS, OPC UA, or PLC questions
3. Write the minimal change that fixes the bug — no refactoring, no unrelated cleanup
4. Never suppress exceptions in control loops — fix the root cause, fail safe
5. Add or update the pytest test that would have caught this bug
6. If the bug touches a register write or actuator output: add `# SAFETY: verify interlock conditions`
7. Mark all generated code: `# <AI-Generated START>` ... `# <AI-Generated END>`

## Task
{user_request}

## Relevant code
{code_context}
