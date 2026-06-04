# Generate (Industrial)

Generate the industrial automation code described below.

## Before writing
1. Call `search_knowledge("{protocol or pattern}", collection="automation")` — MODBUS, OPC UA, PLC, SCADA
2. Call `search_knowledge("{system behavior}", collection="systems_thinking")` — control loops, failure modes
3. Call `search_knowledge("{security control}", collection="gov")` for ICS security requirements
4. Call `search_code_examples("{pattern}", language="python")` for implementation examples
5. Read the provided existing code — match conventions exactly

## Rules
- pytest test file first, then production file
- One file per fenced code block, filename as the block label
- Python 3.10+; type hints on all function signatures
- `async def` / `asyncio` for I/O-bound work (polling loops, subscriptions)
- Named constants for all MODBUS function codes and register addresses — never bare integers
- Validate all process values at system boundaries
- Never suppress exceptions in control loops — fail safe
- Any actuator write: include `# SAFETY: verify interlock conditions`
- Mark all generated code: `# <AI-Generated START>` ... `# <AI-Generated END>`
- If uncertain about a register address or protocol constant: `[CANNOT COMPLETE: <reason>]`

## Existing code context
{code_context}

## Task
{user_request}
