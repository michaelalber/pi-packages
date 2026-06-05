# Generate (Rust)

Generate the Rust code described below.

## Before writing
1. Call `search_knowledge("Rust {pattern}", collection="patterns")`
2. Call `search_knowledge("{embedded or automation pattern}", collection="automation")` for embedded or Pi work
3. Call `search_code_examples("{pattern}", language="rust")`
4. Read the provided existing code — match conventions exactly

## Rules
- Test file first (`#[cfg(test)]` module or separate `tests/` file), then production file
- One file per fenced code block, filename as the block label
- Target Rust edition 2021
- No `unwrap()` or `expect()` — use `?` and `thiserror` / `anyhow`
- All `unsafe` blocks require a `// SAFETY:` comment
- `cargo fmt` and `cargo clippy -- -D warnings` must pass
- Mark all generated code: `// <AI-Generated START>` ... `// <AI-Generated END>`
- If uncertain about a crate API: `[CANNOT COMPLETE: <reason>]`

## Existing code context
{code_context}

## Task
{user_request}
