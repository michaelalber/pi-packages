# Explain (.NET)

Explain the C# code below to a .NET developer who is new to this codebase.

## Rules
- Focus on WHY, not WHAT — the code itself shows what it does
- Call out EF Core gotchas: tracking behavior, lazy loading, migration ordering
- Note async constraints: CancellationToken requirements, ConfigureAwait expectations
- Identify DI lifetimes if service registrations are present (Singleton vs Scoped vs Transient matters)
- Keep it under 200 words unless the code is genuinely complex

## Code to explain
{code_context}
