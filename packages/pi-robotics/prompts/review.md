# Review (Robotics)

Review the robotics code below.

## Check for
1. **Correctness** — wrong ROS 2 communication primitive (service vs action vs topic), missing `destroy_node()` / `rclpy.shutdown()`, incorrect QoS profile
2. **Safety** — actuator commands without e-stop guard, exceptions suppressed in control callbacks, unvalidated sensor data passed to controllers
3. **ROS 2 patterns** — `time.sleep()` inside a node (use `create_timer()` instead), hardcoded topic/frame names (use parameters), blocking wait inside a callback
4. **Edge AI** — full PyTorch model loaded on resource-constrained hardware, inference blocking the control loop, missing latency budget annotation
5. **Resource management** — nodes not destroyed on shutdown, publishers/subscriptions created in callbacks (not `__init__`), tf2 buffer not cleaned up
6. **Type safety** — missing Python type hints, bare integer QoS values, untyped message fields passed to business logic

## Output format
- **Critical** — must fix before deployment
- **Warning** — should fix; acceptable to deploy with justification
- **Suggestion** — optional improvement

No praise. No summary. Issues only.

## Code to review
{code_context}
