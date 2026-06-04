# Explain (Industrial)

Explain the industrial automation code below to an engineer who is new to this codebase.

## Rules
- Focus on WHY, not WHAT — the code itself shows what it does
- Call out safety-critical paths: interlock logic, SIL assumptions, fail-safe behavior
- Note protocol gotchas: MODBUS register addressing (0-indexed vs 1-indexed), OPC UA namespace index usage
- Identify any async constraints: subscription lifecycle, polling interval tradeoffs
- Flag any deviation from NIST 800-82 or ICS security best practices
- Keep it under 200 words unless the code is genuinely complex

## Code to explain
{code_context}
