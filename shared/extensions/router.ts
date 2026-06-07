// <AI-Generated START>
// Routes to PC or Mac Mini based on message complexity heuristic.
// Override at any time with Ctrl+L model cycling.
//
// Routing targets are read from ~/.pi/agent/router-config.json each session.
// Falls back to DEFAULTS if the file is absent or malformed.
// See shared/models/router-config.example.json for the format.

import * as fs from "fs";
import * as os from "os";
import * as path from "path";

interface RouterConfig {
  medium?: string;   // model ID for 150–500 token messages (PC tier)
  complex?: string;  // model ID for 500+ token messages (Mac Mini tier)
}

const THRESHOLDS = {
  simple: 150,  // stay on current machine (fast local model)
  medium: 500   // PC tier; above → Mac Mini tier
} as const;

const DEFAULTS: Required<RouterConfig> = {
  medium: "pc/phi4:14b",
  complex: "mac-mini/codestral:22b"
};

const CONFIG_PATH = path.join(os.homedir(), ".pi", "agent", "router-config.json");

function loadConfig(): Required<RouterConfig> {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
    const parsed = JSON.parse(raw) as RouterConfig;
    return {
      medium: parsed.medium ?? DEFAULTS.medium,
      complex: parsed.complex ?? DEFAULTS.complex
    };
  } catch {
    return { ...DEFAULTS };
  }
}

export default function(pi: ExtensionAPI) {
  pi.on("input", async (event, ctx) => {
    const text = (event as { text?: string }).text ?? "";
    const len = text.length;
    if (len < THRESHOLDS.simple) return;

    const models = loadConfig();
    const target = len < THRESHOLDS.medium ? models.medium : models.complex;
    await pi.setModel(target);
    ctx.ui.notify(`Routed to ${target} (message length: ${len})`);
  });
}
// <AI-Generated END>
