# Decompose (PHP / Laravel)

Break the PHP / Laravel feature below into atomic steps before executing.

## Rules
1. List numbered steps — one sentence each, one file per step
2. Start each production file step with its corresponding Pest test file step
3. Mark steps that create or modify migrations — these run separately and need DB coordination
4. Mark steps that add service provider bindings — may require `config:cache` clear in production
5. Mark steps that change public API contracts (routes, Form Request rules) — check for downstream consumers first
6. Stop after the list — wait for confirmation before executing

## Task
{user_request}
