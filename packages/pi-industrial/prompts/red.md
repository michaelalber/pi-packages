# Red (Industrial)

Write ONE failing pytest test for: {user_request}

## Rules
- One test only — do not write any production code
- The test must fail for a semantic reason (not an import error)
- All existing tests must still pass
- Run `pytest -v` and show the failure output before stopping
- Any test of actuator or write logic: mock hardware; add `# SAFETY: verify interlock conditions` comment
