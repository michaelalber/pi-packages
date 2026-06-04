# Generate (PHP / Laravel)

Generate the PHP / Laravel code described below.

## Before writing
1. Call `search_knowledge("Laravel {pattern}", collection="php")`
2. Call `search_knowledge("{component}", collection="javascript")` for Vue.js / TypeScript work
3. Call `search_code_examples("{pattern}", language="php")`
4. Read the provided existing code — match conventions exactly

## Rules
- Pest test file first, then production file
- One file per fenced code block, filename as the block label
- `declare(strict_types=1)` at the top of every PHP file
- Type-hint all parameters and return types
- Use Laravel Form Requests for input validation — never raw `$request->input()`
- Eloquent or bound Query Builder only — no string-concatenated SQL ever
- Access config via `config()` — never `env()` in application code
- Prefer injected service classes over static facades in business logic
- Mark all generated code: `# <AI-Generated START>` ... `# <AI-Generated END>`
- If uncertain about a Laravel API: `[CANNOT COMPLETE: <reason>]`

## Existing code context
{code_context}

## Task
{user_request}
