# industrial

Use this skill when working on Industrial Automation, SCADA/HMI, PLC programming (IEC 61131-3), MODBUS, OPC UA, industrial Python/Rust, or ICS security.

## Before writing any code
1. Call `search_knowledge("{protocol or pattern}", collection="automation")` — MODBUS, OPC UA, PLC, SCADA patterns
2. Call `search_knowledge("{system behavior}", collection="systems_thinking")` — feedback loops, control theory, failure modes
3. Call `search_knowledge("{security control}", collection="gov")` for ICS security (NIST 800-82, NERC CIP, SIL)
4. Call `search_code_examples("{pattern}", language="python")` for Python implementation examples
5. Call `search_code_examples("{pattern}", language="rust")` for Rust/embedded examples
6. Use returned patterns — never invent register addresses, function codes, or protocol constants

## Invariants
- Target Python 3.10+ for host-side automation code; Rust stable for embedded/real-time paths
- Use type hints on all Python function signatures
- Use `async def` / `asyncio` for I/O-bound work (OPC UA subscriptions, MODBUS polling loops)
- Validate all process values at system boundaries — never trust raw register data
- Use named constants for all MODBUS function codes, register addresses, and OPC UA node IDs
- Never hardcode IP addresses or port numbers — use config files or environment variables
- Mark all generated blocks: `# <AI-Generated START>` ... `# <AI-Generated END>`

## Safety rules
- Any code touching physical actuators or safety systems requires an explicit human review step
- Flag every write to a coil or holding register with a `# SAFETY: verify interlock conditions` comment
- Never suppress exceptions in control loops — surface faults visibly, fail safe
- Document SIL rating assumptions for any safety-critical path

## MODBUS rules
- Use Modbus function codes by name constant, not bare integer (e.g., `READ_HOLDING_REGISTERS`, not `3`)
- Address register maps in comments — register number, data type, engineering units, valid range
- Validate response CRC and exception codes before acting on data
- Log every coil write with timestamp and operator identity

## OPC UA rules
- Use subscription + monitored items for live data — never poll in a tight loop
- Authenticate with X.509 certificates in production; document if using anonymous for dev only
- Namespace index 0 is reserved for OPC UA standard nodes — never write to it
- Disconnect and clean up subscriptions explicitly; never rely on GC

## ICS security (NIST 800-82 / NERC CIP)
- Isolate OT from IT networks — document any data diode or DMZ boundary in code comments
- All remote access must go through authenticated jump host — no direct internet exposure
- Log all configuration changes to an append-only audit trail
- Credential storage: use a secrets manager or hardware security module — never plaintext in source

## Task approach
- Single register read / write: generate directly
- Feature touching protocol + data model + UI: list steps → wait for confirmation → one file at a time
- Any uncertainty about register map or protocol constant: `[CANNOT COMPLETE: <reason>]` — never guess addresses

## Quality gates
- pytest test file created before production file
- Cyclomatic complexity per function < 10
- All public functions have docstrings documenting engineering units and valid ranges
- Safety-critical paths: code coverage ≥ 95%

## Output format
- Code only in fenced code blocks
- One file per block, filename as the block label
- pytest test file before production file
- Never output preamble or trailing summaries

## grounded-code collections for this project type
| Collection | Use for |
|---|---|
| `automation` | MODBUS, OPC UA, PLC/IEC 61131-3, SCADA, Raspberry Pi, NIST 800-82 |
| `systems_thinking` | Control theory, feedback loops, failure mode analysis, resilience |
| `gov` | NIST 800-53/82, NERC CIP, Zero Trust for OT, CUI handling |
| `python` | Python 3.13, asyncio, Pydantic v2, pytest — host-side automation |
| `edge_ai` | ML on edge devices, anomaly detection for sensor streams |
