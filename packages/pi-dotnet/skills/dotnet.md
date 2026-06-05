# dotnet

Use this skill when working on .NET, C#, ASP.NET Core, Entity Framework Core, SQL Server, or React / TypeScript projects.

## Before writing any code
1. Call `search_knowledge("C# {pattern}", collection="dotnet")` — EF Core, DI, ASP.NET Core, Telerik
2. Call `search_knowledge("SQL {pattern}", collection="databases")` for any SQL or EF Core work
3. Call `search_knowledge("{component}", collection="javascript")` for React / TypeScript work
4. Call `search_knowledge("{pattern}", collection="patterns")` for CQRS, Clean Architecture, DDD questions
5. Call `search_code_examples("{pattern}", language="csharp")` for implementation examples
6. Use returned patterns — never invent method signatures or library APIs

## Invariants
- Target .NET 10 unless project context specifies otherwise
- Enable nullable reference types; treat warnings as errors
- Prefer `async`/`await` end-to-end — never `.Result` or `.Wait()` on async methods
- Propagate `CancellationToken` through all async call chains
- Use `using` / `await using` for all `IDisposable` / `IAsyncDisposable` resources
- Vertical slice architecture: feature folders, not layer folders
- CQRS: commands mutate state, queries return data — never mix
- Parameterized queries only — no string-concatenated SQL under any circumstances
- Mark all generated blocks: `// <AI-Generated START>` ... `// <AI-Generated END>`

## Task approach
- Single function or property: generate directly
- Feature touching 2+ files: list steps → wait for confirmation → execute one file at a time
- Any uncertainty about a .NET API: `[CANNOT COMPLETE: <reason>]` — never guess

## Quality gates
- Cyclomatic complexity per method < 10
- xUnit test file created before production file
- All public API members have XML doc comments
- Code coverage target ≥ 80% for business logic, ≥ 95% for security-critical paths

## EF Core rules
- Use `AsNoTracking()` on all read-only queries
- Never call `SaveChangesAsync()` inside a loop
- Name migrations descriptively: `AddUserEmailIndex`, not `Migration001`
- Test migrations in a separate step — coordinate with the database owner

## Output format
- Code only in fenced code blocks
- One file per block, filename as the block label
- xUnit test file before production file
- Never output preamble or trailing summaries

## grounded-code collections for this project type
| Collection | Use for |
|---|---|
| `dotnet` | EF Core in Action, DI in .NET, ASP.NET Core, Telerik components |
| `databases` | SQL Server patterns, indexing, relational theory |
| `javascript` | React, TypeScript, Vue |
| `patterns` | CQRS, Clean Architecture, DDD, vertical slice |
| `internal` | XP practices, TDD, OWASP, engineering standards |
