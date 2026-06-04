// Pi agent extension API type definitions
// Derived from Pi v1.x (Earendil Inc.) — update as the API stabilizes

interface ContextUsage {
  used: number;
  max: number;
}

interface EventContext {
  message?: string;
  cwd?: string;
  setModel(modelId: string): Promise<void>;
  getContextUsage(): Promise<ContextUsage | null>;
  compact(): Promise<void>;
  notify(message: string): void;
  loadSkill(name: string): Promise<void>;
}

type EventHandler = (event: unknown, ctx: EventContext) => Promise<void> | void;

interface ToolParameter {
  type: "string" | "number" | "boolean";
  description?: string;
  enum?: string[];
  optional?: boolean;
}

interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, ToolParameter>;
  execute(params: Record<string, unknown>): Promise<string> | string;
}

type PiEvent =
  | "session_start"
  | "context_updated"
  | "message_processed";

interface ExtensionAPI {
  registerTool(tool: ToolDefinition): void;
  on(event: PiEvent, handler: EventHandler): void;
  callMcp(server: string, tool: string, params: Record<string, unknown>): Promise<unknown>;
}
