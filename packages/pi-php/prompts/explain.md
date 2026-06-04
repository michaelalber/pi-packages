# Explain (PHP / Laravel)

Explain the PHP / Laravel code below to a developer who is new to this codebase.

## Rules
- Focus on WHY, not WHAT — the code itself shows what it does
- Call out Eloquent gotchas: eager vs lazy loading, N+1 risk, relationship caching
- Note Laravel lifecycle details: when service providers bind, how middleware chains execute
- Identify DI container bindings if present — interface vs concrete, singleton vs scoped matters
- Flag any `env()` calls in application code or raw SQL — these are correctness / security concerns
- Keep it under 200 words unless the code is genuinely complex

## Code to explain
{code_context}
