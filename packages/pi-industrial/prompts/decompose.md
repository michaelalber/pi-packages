# Decompose (Industrial)

Break the industrial automation feature below into atomic steps before executing.

## Rules
1. List numbered steps — one sentence each, one file per step
2. Start each production file step with its corresponding pytest test file step
3. Mark steps that write to physical outputs (coils, AO registers) — these need human safety review before deploy
4. Mark steps that change communication configuration (IP, port, node ID) — coordinate with the OT network owner
5. Mark steps that modify security boundaries (firewall rules, auth config) — escalate per NIST 800-82 change control
6. Mark steps that require device downtime or maintenance window
7. Stop after the list — wait for confirmation before executing

## Task
{user_request}
