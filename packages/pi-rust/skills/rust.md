---
name: rust
description: >
  Rust systems programming, embedded (embassy, rp-hal), CLI tools, Axum web services,
  and Rust robotics (rclrs). Use when working on any Rust project.
---

# rust

Use this skill when working on Rust — systems programming, embedded (embassy, rp-hal), CLI tools, Axum web services, or Rust robotics (rclrs).

## Before writing any code
1. Call `search_knowledge("Rust {pattern}", collection="patterns")` — trait design, CQRS, Clean Architecture
2. Call `search_knowledge("{embedded or Pi pattern}", collection="automation")` for embassy, rp-hal, MODBUS, Raspberry Pi
3. Call `search_knowledge("async {pattern}", collection="architecture")` for Tokio patterns, distributed systems
4. Call `search_knowledge("{security or TDD pattern}", collection="internal")` for OWASP, engineering standards
5. Call `search_code_examples("{pattern}", language="rust")` for implementation examples
6. Use returned patterns — never invent crate APIs or method signatures

## Invariants
- Target Rust edition 2021 unless project context specifies otherwise
- No `unwrap()` or `expect()` in library or production code — use `?` and proper error propagation
- All `unsafe` blocks require a `// SAFETY:` comment explaining the upheld invariant
- Use `thiserror` for library errors; `anyhow` for application/binary errors
- Prefer `Arc<dyn Trait>` for shared state that must be testable in isolation
- No compiler warnings — run `cargo clippy -- -D warnings` before committing
- Run `cargo fmt` before every commit — no style exceptions
- Prefer `tokio` for async unless the project constrains to another runtime
- Mark all generated blocks: `// <AI-Generated START>` ... `// <AI-Generated END>`

## Task approach
- Single function or struct: generate directly
- Feature touching 2+ files: list steps → wait for confirmation → one file at a time
- Any uncertainty about a crate API: `[CANNOT COMPLETE: <reason>]` — never guess

## Quality gates
- `cargo test` must pass; test file created before production file
- Cyclomatic complexity per function < 10
- All public items in library crates have doc comments (`///`)
- Coverage ≥ 80% for business logic; ≥ 95% for unsafe or security-critical paths

## Output format
- Code only in fenced code blocks
- One file per block, filename as the block label
- Test file before production file
- Never output preamble or trailing summaries

## grounded-code collections for this project type
| Collection | Use for |
|---|---|
| `patterns` | Trait-based design, CQRS, Clean Architecture, DDD |
| `automation` | Embedded Rust, embassy, rp-hal, Raspberry Pi, MODBUS, OPC UA |
| `architecture` | Tokio async patterns, distributed systems, 12-Factor |
| `robotics` | rclrs (ROS 2 Rust), edge robotics |
| `internal` | XP practices, TDD, OWASP, engineering standards |
