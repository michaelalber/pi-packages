# Fix (Robotics)

Fix the bug described below.

## Rules
1. Read the failing code — understand the root cause before writing anything
2. Call `search_knowledge("ROS 2 {pattern}", collection="robotics")` for node, topic, service, or action questions
3. Call `search_knowledge("{pattern}", collection="automation")` for control loop, sensor, or hardware interface questions
4. Write the minimal change that fixes the bug — no refactoring, no unrelated cleanup
5. Never introduce `time.sleep()` inside a ROS 2 node callback — fix timing issues with `create_timer()`
6. Add or update the test that would have caught this bug
7. If the bug involves a physical actuator: add `# SAFETY: verify interlock and e-stop before deployment` comment
8. Mark all generated code: `# <AI-Generated START>` ... `# <AI-Generated END>`

## Task
{user_request}

## Relevant code
{code_context}
