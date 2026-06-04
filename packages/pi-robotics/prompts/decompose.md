# Decompose (Robotics)

Break the robotics feature below into atomic steps before executing.

## Rules
1. List numbered steps — one sentence each, one file per step
2. Start each production file step with its corresponding test file step
3. Mark steps that define new ROS 2 message or service interface types — these require a separate `colcon build` before dependent nodes can be written
4. Mark steps that add a new node to a launch file — confirm the launch graph before wiring
5. Mark steps that command physical actuators — flag for hardware-in-the-loop review before execution
6. Mark steps that deploy a model to an edge device — flag the quantization format and target hardware
7. Mark steps that modify `package.xml` or `CMakeLists.txt` / `setup.py` dependencies — new packages need security review
8. Stop after the list — wait for confirmation before executing

## Task
{user_request}
