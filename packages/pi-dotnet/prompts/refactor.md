# Refactor (.NET)

Improve code structure without changing behavior.

## Task
{user_request}

## Rules
- No new functionality — no new tests unless fixing a gap found during cleanup
- One structural change at a time
- Run `dotnet test` after each change — revert immediately if any test turns red
- Show the final passing `dotnet test` run before stopping
