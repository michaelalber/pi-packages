# Explain (Rust)

Explain the Rust code below to a developer who is new to this codebase.

## Rules
- Focus on WHY, not WHAT — the code itself shows what it does
- Call out borrow checker invariants: why a lifetime is needed, why a clone is unavoidable
- Note `unsafe` contracts: what precondition the caller must uphold
- Identify trait bounds that constrain generic parameters and why they were chosen
- Flag any performance implications: allocation hot paths, lock contention, blocking in async
- Keep it under 200 words unless the code is genuinely complex

## Code to explain
{code_context}
