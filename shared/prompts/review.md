# Review

Review the code below.

## Check for
1. **Correctness** — does it do what it claims?
2. **Security** — injection, validation gaps, secrets in code
3. **Error handling** — unhandled exceptions, missing null checks
4. **Performance** — obvious bottlenecks (N+1, blocking I/O, unbounded loops)
5. **Conventions** — matches surrounding codebase style

## Output format
- **Critical** — must fix before merge
- **Warning** — should fix; acceptable to merge with justification
- **Suggestion** — optional improvement

No praise. No summary. Issues only.

## Code to review
{code_context}
