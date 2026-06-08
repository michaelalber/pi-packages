# Refactor (PHP / Laravel)

Improve code structure without changing behavior.

## Task
{user_request}

## Rules
- No new functionality — no new tests unless fixing a gap found during cleanup
- One structural change at a time
- Run `php artisan test` after each change — revert immediately if any test turns red
- Show the final passing `php artisan test` run before stopping
