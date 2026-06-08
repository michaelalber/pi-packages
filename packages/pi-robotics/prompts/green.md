# Green (Robotics)

Make this failing test pass.

## Task
{user_request}

## Rules
- Write the MINIMUM code that makes the test pass — nothing it does not require
- No refactoring, no untested branches, no speculative safety logic
- Any actuator command in production code: add `# SAFETY: verify interlock conditions` comment
- Run `pytest -v` or `colcon test` and show all tests passing before stopping
