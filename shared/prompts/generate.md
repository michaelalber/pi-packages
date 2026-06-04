# Generate

Generate the code described below.

## Before writing
1. Call `search_knowledge` for any unfamiliar pattern
2. Call `search_code_examples` for implementation examples
3. Read the provided existing code — match conventions exactly

## Rules
- Test file first, then production file
- One file per fenced code block, filename as the block label
- Mark all generated code: `// <AI-Generated START>` ... `// <AI-Generated END>`
- If uncertain about a method signature: `[CANNOT COMPLETE: <reason>]`

## Existing code context
{code_context}

## Task
{user_request}
