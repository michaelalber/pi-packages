# Generate (.NET)

Generate the C# / ASP.NET Core code described below.

## Before writing
1. Call `search_knowledge("C# {pattern}", collection="dotnet")`
2. Call `search_knowledge("SQL {pattern}", collection="databases")` for EF Core / SQL work
3. Call `search_code_examples("{pattern}", language="csharp")`
4. Read the provided existing code — match conventions exactly

## Rules
- xUnit test file first, then production file
- One file per fenced code block, filename as the block label
- Target .NET 10; enable nullable reference types
- `async`/`await` end-to-end; propagate `CancellationToken`
- Vertical slice: feature folders, not layer folders
- CQRS: commands mutate, queries return — never mix
- Parameterized queries only — never string-concatenate SQL
- Mark all generated code: `// <AI-Generated START>` ... `// <AI-Generated END>`
- If uncertain about a .NET API: `[CANNOT COMPLETE: <reason>]`

## Existing code context
{code_context}

## Task
{user_request}
