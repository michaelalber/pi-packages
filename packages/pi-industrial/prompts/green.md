# Green (Industrial)

Make this failing pytest test pass.

## Task
{user_request}

## Rules
- Write the MINIMUM Python code that makes the test pass — nothing it does not require
- No refactoring, no untested error paths
- Any actuator write in production code: add `# SAFETY: verify interlock conditions` comment
- Never suppress exceptions in control loop code
- Run `pytest -v` and show all tests passing before stopping
