---
name: robotics
description: >
  Robotics — ROS 2 (Python or C++), physical simulation (MuJoCo, Isaac Lab), VLA models,
  edge AI inference, LeRobot, and Raspberry Pi / Jetson platforms.
---

# robotics

Use this skill when working on Robotics — ROS 2 (Python or C++), physical simulation (MuJoCo, Isaac Lab), vision-language-action (VLA) models, edge AI inference, LeRobot, or Raspberry Pi / Jetson robot platforms.

## Before writing any code
1. Call `search_knowledge("ROS 2 {pattern}", collection="robotics")` — nodes, topics, services, actions, lifecycle, tf2, nav2
2. Call `search_knowledge("{algorithm or framework}", collection="robotics")` for MuJoCo, Isaac Lab, OpenVLA, LeRobot
3. Call `search_knowledge("edge inference {pattern}", collection="edge_ai")` for TFLite, ONNX Runtime, Jetson deployment
4. Call `search_knowledge("{control or sensor pattern}", collection="automation")` for control loops, sensor gateways, MQTT
5. Call `search_knowledge("{system behavior}", collection="systems_thinking")` for feedback loops, failure modes
6. Call `search_code_examples("{pattern}", language="python")` for Python implementation examples
7. Call `search_code_examples("{pattern}", language="cpp")` for C++ / rclcpp implementation examples
8. Use returned patterns — never invent ROS 2 message types, topic names, or API signatures

## Invariants
- Target ROS 2 Jazzy (or Humble LTS if project specifies); do not mix ROS 1 and ROS 2 APIs
- Use Python 3.10+ for Python nodes; C++17 for rclcpp nodes
- Type hints on all Python function signatures; no untyped `def`
- Use `rclpy.spin()` / `rclpy.spin_once()` — never busy-wait with `time.sleep()` in a node
- Use `create_timer()` for periodic callbacks — never `while True` loops inside a node
- Prefer actions for long-running tasks (navigation, manipulation); services for short synchronous calls; topics for continuous streams
- Never put a service server in a blocking wait inside a callback — use asynchronous callbacks or a separate executor thread
- Name topics, services, and actions with the package-namespaced convention: `/{package}/{noun}` (e.g., `/my_robot/cmd_vel`)
- Always call `node.destroy_node()` and `rclpy.shutdown()` in `main()` — never rely on GC
- Use `QoSProfile` explicitly for sensor data (SENSOR_DATA) and control commands (RELIABLE); never use bare integer QoS values
- Mark all generated blocks: `# <AI-Generated START>` ... `# <AI-Generated END>` (Python) or `// <AI-Generated START>` (C++)

## Safety rules
- Any node commanding physical actuators requires an explicit human review step before deployment
- Always implement an emergency-stop subscriber (`/e_stop` or equivalent); document the topic name in a comment
- Never suppress exceptions in control loop callbacks — log and publish a fault state instead
- Validate sensor inputs at node boundaries — never pass raw unvalidated values to a controller
- For hardware-in-the-loop tests, add a `# SAFETY: test on simulated hardware first` comment on every actuator write

## ROS 2 architecture rules
- One node, one logical responsibility — split concerns across nodes, not within one node
- Use `rclpy.Parameter` / `ros2 param` for runtime-configurable values — never hardcode frame IDs, topic names, or rates
- Use `tf2` for all coordinate frame transforms — never compute transforms manually
- Use `ros2 bag record` / `rosbag2` for test data capture; never hardcode sensor replay sequences in tests
- For lifecycle nodes, implement all lifecycle transitions (`on_configure`, `on_activate`, `on_deactivate`, `on_cleanup`) — never leave them as stubs in production code

## Edge AI / inference rules
- Deploy quantized models (INT8/FP16) for Jetson / Raspberry Pi — document the quantization level in a comment
- Use ONNX Runtime or TFLite for edge inference — never load full PyTorch models on resource-constrained hardware unless the device has adequate RAM
- Separate inference from control: run inference in a dedicated node or thread; publish results as a topic; never block the control loop
- Cap input tensor preprocessing time; if preprocessing + inference exceeds the control loop period, flag `# VERIFY: latency budget`

## Task approach
- Single node or single callback: generate directly
- Feature spanning multiple nodes, launch files, or message types: list steps → wait for confirmation → one file at a time
- Any uncertainty about a ROS 2 API, message type, or hardware interface: `[CANNOT COMPLETE: <reason>]` — never guess

## Quality gates
- pytest test file (or `ament_cmake` / `colcon` test) created before production file
- Cyclomatic complexity per function/method < 10
- All public ROS 2 nodes and service interfaces have docstrings (one-line summary only)
- Safety-critical paths (actuator commands, e-stop): code coverage ≥ 95%
- `colcon build --symlink-install` must pass before any PR

## Output format
- Code only in fenced code blocks
- One file per block, filename as the block label
- Test file before production file (pytest for Python nodes; `ament_cmake` / colcon test for C++ nodes)
- Python markers: `# <AI-Generated START>` / `# <AI-Generated END>`; C++ markers: `// <AI-Generated START>` / `// <AI-Generated END>`
- Never output preamble or trailing summaries

## grounded-code collections for this project type
| Collection | Use for |
|---|---|
| `robotics` | ROS 2, MuJoCo, Isaac Lab, OpenVLA, LeRobot, Spinning Up in Deep RL |
| `edge_ai` | ONNX Runtime, TFLite, Jetson, model quantization, sensor anomaly detection |
| `automation` | Control loops, MQTT, sensor gateways, Raspberry Pi, NIST 800-82 |
| `systems_thinking` | Feedback loops, failure mode analysis, resilience, chaos engineering |
| `python` | Python 3.13, asyncio, Pydantic v2, pytest — host-side and simulation code |
| `internal` | XP practices, TDD, OWASP, engineering standards |
