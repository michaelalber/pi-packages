# Refactor (Rust)

Improve code structure without changing behavior.

## Task
{user_request}

## Rules
- No new functionality — no new tests unless fixing a gap found during cleanup
- One structural change at a time; `cargo fmt` and `cargo clippy -- -D warnings` must pass after each
- Run `cargo test` after each change — revert immediately if any test turns red
- Show the final passing `cargo test` run before stopping
