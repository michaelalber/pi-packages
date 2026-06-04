# Decompose (.NET)

Break the .NET feature below into atomic steps before executing.

## Rules
1. List numbered steps — one sentence each, one file per step
2. Start each production file step with its corresponding xUnit test file step
3. Mark steps that touch EF Core migrations — these run separately and need DB coordination
4. Mark steps that modify `Program.cs` DI registrations — may require integration test updates
5. Mark steps that change public API contracts — check for downstream consumers first
6. Stop after the list — wait for confirmation before executing

## Task
{user_request}
