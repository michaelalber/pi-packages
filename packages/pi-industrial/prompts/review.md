# Review (Industrial)

Review the industrial automation code below.

## Check for
1. **Safety** — unguarded actuator writes, missing interlock checks, suppressed exceptions in control loops
2. **Protocol correctness** — bare integer function codes, unvalidated register data, missing CRC/exception checks
3. **Security (ICS)** — hardcoded credentials, direct internet exposure, missing audit logging for coil writes
4. **Async** — tight polling loops that should use subscriptions, missing cleanup of OPC UA subscriptions
5. **Conventions** — named constants for addresses, type hints, docstrings with engineering units

## Output format
- **Critical** — must fix before deploy (safety or correctness issue)
- **Warning** — should fix; acceptable to deploy with justification
- **Suggestion** — optional improvement

No praise. No summary. Issues only.

## Code to review
{code_context}
