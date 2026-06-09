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
  medium?: string;   // model ID for messages under 500 chars (default tier)
  complex?: string;  // model ID for 500+ char messages (complex tier)
}

const THRESHOLDS = {
  simple: 0,    // all messages route; no fast-path escape to boot model
  medium: 500   // above → complex tier
} as const;

const CONFIG_PATH = path.join(os.homedir(), ".pi", "agent", "router-config.json");

function loadConfig(): RouterConfig {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
    return JSON.parse(raw) as RouterConfig;
  } catch {
    return {};
  }
}

export default function(pi: ExtensionAPI) {
  pi.on("input", async (event, ctx) => {
    const text = (event as { text?: string }).text ?? "";
    const len = text.length;
    if (len < THRESHOLDS.simple) return;

    const models = loadConfig();
    const target = len < THRESHOLDS.medium ? models.medium : models.complex;
    if (!target) return;
    await pi.setModel(target);
    ctx.ui.notify(`Routed to ${target} (message length: ${len})`);
  });
}
// <AI-Generated END>
