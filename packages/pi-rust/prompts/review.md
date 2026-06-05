# Review (Rust)

Review the Rust code below.

## Check for
1. **Correctness** — logic errors, panic paths (`unwrap`/`expect`/index out-of-bounds), missing error propagation
2. **Safety** — every `unsafe` block has a `// SAFETY:` comment; no UB-prone patterns
3. **Ownership** — unnecessary clones, missed borrows, incorrect lifetime annotations
4. **Async** — blocking calls inside async context, missing `.await`, unhandled `JoinError`
5. **Error handling** — `thiserror` in libraries, `anyhow` in binaries; no `panic!` in production paths
6. **Clippy / style** — `cargo clippy -- -D warnings` clean; `cargo fmt` applied

## Output format
- **Critical** — must fix before merge
- **Warning** — should fix; acceptable to merge with justification
- **Suggestion** — optional improvement

No praise. No summary. Issues only.

## Code to review
{code_context}
