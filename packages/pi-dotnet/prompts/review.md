# Review (.NET)

Review the C# / ASP.NET Core code below.

## Check for
1. **Correctness** — logic errors, wrong async patterns (`.Result`/`.Wait()`), missing null handling
2. **Security** — SQL injection, missing input validation, secrets in code, OWASP Top 10
3. **EF Core** — N+1 queries, missing `AsNoTracking()` on reads, `SaveChangesAsync()` in loops
4. **Async** — `ConfigureAwait` usage, `CancellationToken` propagation, blocking calls on async
5. **Conventions** — nullable reference types enabled, `using`/`await using` for `IDisposable`

## Output format
- **Critical** — must fix before merge
- **Warning** — should fix; acceptable to merge with justification
- **Suggestion** — optional improvement

No praise. No summary. Issues only.

## Code to review
{code_context}
