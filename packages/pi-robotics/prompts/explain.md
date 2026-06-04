# Explain (Robotics)

Explain the robotics code below to a developer who is new to this codebase.

## Rules
- Focus on WHY, not WHAT — the code itself shows what it does
- Call out ROS 2 communication choices: why a topic vs service vs action was used for this interaction
- Identify QoS profiles and explain why SENSOR_DATA or RELIABLE was chosen — mismatching QoS between publisher and subscriber silently drops messages
- Note any `tf2` frame graph assumptions — missing transforms cause silent failures, not exceptions
- Flag `time.sleep()` or `while True` patterns if present — explain the correct `create_timer()` replacement
- For edge AI nodes: explain the inference pipeline, latency assumptions, and which hardware the model targets
- Note any safety guards (e-stop subscribers, fault publishers) and what happens if they are missing
- Keep it under 200 words unless the code is genuinely complex

## Code to explain
{code_context}
