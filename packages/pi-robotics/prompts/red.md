# Red (Robotics)

Write ONE failing test for: {user_request}

## Rules
- One test only — do not write any production code
- The test must fail for a semantic reason (not an import or build error)
- All existing tests must still pass
- Run `pytest -v` (Python nodes) or `colcon test --packages-select <pkg>` and show the failure before stopping
- Any test of actuator or command logic: mock hardware; add `# SAFETY: verify interlock and e-stop before deployment` comment
