// Pi agent extension API type definitions
// Updated for Pi v0.78+ (Earendil Inc.) — ctx.loadSkill removed; resources_discover added

interface ContextUsage {
  used: number;
  max: number;
}

// Payload returned by a resources_discover handler to inject skill/prompt/theme files.
interface ResourcesDiscoverResult {
  skillPaths?: string[];
  promptPaths?: string[];
  themePaths?: string[];
}

interface UIContext {
  notify(message: string): void;
  confirm(message: string): Promise<boolean>;
  input(prompt: string): Promise<string | undefined>;
  select(options: string[]): Promise<string | undefined>;
}

interface EventContext {
  cwd?: string;
  ui: UIContext;
  getContextUsage(): ContextUsage | undefined;
  compact(options?: Record<string, unknown>): void;
  getSystemPrompt(): string | undefined;
  isIdle(): boolean;
  abort(): void;
  shutdown(): void;
  hasPendingMessages(): boolean;
}

type EventHandler = (
  event: unknown,
  ctx: EventContext
) => Promise<ResourcesDiscoverResult | undefined | void> | ResourcesDiscoverResult | undefined | void;

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
  | "message_processed"
  | "resources_discover"
  | "input"
  | "message_end"
  | "context"
  | "session_before_switch"
  | "session_before_fork"
  | "session_before_compact"
  | "session_before_tree";

interface ExtensionAPI {
  on(event: PiEvent, handler: EventHandler): void;
  registerTool(tool: ToolDefinition): void;
  registerCommand(name: string, options: Record<string, unknown>): void;
  sendMessage(message: string, options?: Record<string, unknown>): void;
  sendUserMessage(content: string, options?: Record<string, unknown>): void;
  setModel(model: string): Promise<void>;
  getThinkingLevel(): unknown;
  setThinkingLevel(level: unknown): void;
  callMcp(server: string, tool: string, params: Record<string, unknown>): Promise<unknown>;
}
