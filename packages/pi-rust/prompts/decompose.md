# Decompose (Rust)

Break the Rust feature below into atomic steps before executing.

## Rules
1. List numbered steps — one sentence each, one file per step
2. Start each production file step with its corresponding test file step
3. Mark steps that add or modify `Cargo.toml` dependencies — these require a `cargo check` gate
4. Mark steps that introduce `unsafe` — these require a separate safety-review step
5. Mark steps that change a public API (trait, struct, function signature) — check for downstream consumers first
6. Stop after the list — wait for confirmation before executing

## Task
{user_request}
