# Generate (Robotics)

Generate the robotics code described below.

## Before writing
1. Call `search_knowledge("ROS 2 {pattern}", collection="robotics")` for nodes, topics, services, actions, nav2, tf2
2. Call `search_knowledge("{algorithm or framework}", collection="robotics")` for MuJoCo, Isaac Lab, OpenVLA, LeRobot
3. Call `search_knowledge("edge inference {pattern}", collection="edge_ai")` for ONNX, TFLite, Jetson deployment
4. Call `search_knowledge("{control or sensor pattern}", collection="automation")` for control loops, sensor gateways
5. Call `search_code_examples("{pattern}", language="python")` for Python / rclpy examples
6. Call `search_code_examples("{pattern}", language="cpp")` for C++ / rclcpp examples
7. Read the provided existing code — match conventions exactly

## Rules
- Test / colcon test file first, then production file
- One file per fenced code block, filename as the block label
- Use `create_timer()` for periodic callbacks — never `time.sleep()` or `while True` in a node
- Always call `node.destroy_node()` and `rclpy.shutdown()` in `main()`
- Use `QoSProfile` explicitly — `SENSOR_DATA` for sensor topics, `RELIABLE` for commands
- Use `ros2 param` / `rclpy.Parameter` for all configurable values — no hardcoded topic names or rates
- Use `tf2` for all coordinate frame transforms
- Any actuator command code: add `# SAFETY: verify interlock and e-stop before deployment` comment
- Mark all generated code: `# <AI-Generated START>` ... `# <AI-Generated END>` (Python) or `// <AI-Generated START>` (C++)
- If uncertain about a ROS 2 API or message type: `[CANNOT COMPLETE: <reason>]`

## Existing code context
{code_context}

## Task
{user_request}
