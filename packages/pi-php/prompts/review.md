# Review (PHP / Laravel)

Review the PHP / Laravel code below.

## Check for
1. **Correctness** — logic errors, missing null handling, wrong Eloquent relationship usage
2. **Security** — SQL injection via raw queries, missing Form Request validation, `env()` called directly in app code, secrets in source, OWASP Top 10
3. **Eloquent** — N+1 queries (missing `with()`), raw SQL without bound parameters, migrations not named descriptively
4. **Laravel conventions** — facades used in business logic instead of injected services, `config()` vs `env()` misuse, missing strict types declaration
5. **Style** — PSR-12 violations, missing type hints, undocumented public service methods

## Output format
- **Critical** — must fix before merge
- **Warning** — should fix; acceptable to merge with justification
- **Suggestion** — optional improvement

No praise. No summary. Issues only.

## Code to review
{code_context}
