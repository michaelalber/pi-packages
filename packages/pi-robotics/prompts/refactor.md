# Refactor (Robotics)

Improve code structure without changing behavior.

## Task
{user_request}

## Rules
- No new functionality — no new tests unless fixing a gap found during cleanup
- Never refactor safety interlocks or e-stop paths — treat them as immutable during refactor
- One structural change at a time
- Run `pytest -v` or `colcon test` after each change — revert immediately if any test turns red
- Show the final passing test run before stopping
