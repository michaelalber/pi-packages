# Global Harness Rules

## Code quality
- Write only what was asked. No preamble, no trailing summaries.
- Mark all generated code: `// <AI-Generated START>` ... `// <AI-Generated END>`
- If uncertain: `[CANNOT COMPLETE: <reason>]` — never hallucinate APIs or method signatures
- Tests before production code, always

## Context
- Call `search_knowledge` before generating any unfamiliar pattern
- Call `search_code_examples` for implementation examples
- Read existing code before writing — match conventions exactly

## Task approach
- Single function: generate directly
- 2+ files: decompose first, confirm, execute one file at a time
- Open-ended design: reason through options, present a recommendation with tradeoffs

## Security
- Parameterized queries only — no string-concatenated SQL under any circumstances
- Never log passwords, tokens, or PII
- Validate all inputs at system boundaries

## Output
- One file per fenced code block, filename as block label
- No TODO comments — either implement it or mark `[CANNOT COMPLETE]`
