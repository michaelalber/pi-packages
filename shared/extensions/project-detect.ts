// <AI-Generated START>
// Detects project type from filesystem signals and auto-loads the matching skill.
// Walks up to 3 parent directories from cwd before giving up.

import * as fs from "fs";
import * as path from "path";

interface Signal {
  test: string | RegExp;
  skill: string;
}

const SIGNALS: Signal[] = [
  { test: /\.csproj$/, skill: "dotnet" },
  { test: /\.sln$/, skill: "dotnet" },
  { test: "composer.json", skill: "php" },
  { test: "artisan", skill: "php" },
  { test: "pyproject.toml", skill: "python" },
  { test: "setup.py", skill: "python" },
  { test: /\.robot$/, skill: "robotics" },
  { test: "ros2_ws", skill: "robotics" },
  { test: "package.xml", skill: "robotics" },
  { test: /plc_project\./i, skill: "industrial" },
  { test: "Cargo.toml", skill: "rust" },
  { test: "Cargo.lock", skill: "rust" },
];

export default function(pi: ExtensionAPI) {
  pi.on("session_start", async (_event, ctx) => {
    const cwd = ctx.cwd ?? process.cwd();
    const detected = detectSkill(cwd, 0);

    if (detected) {
      await ctx.loadSkill(detected);
      ctx.notify(`Auto-loaded skill: ${detected}`);
    }
  });
}

function detectSkill(dir: string, depth: number): string | null {
  if (depth > 3) return null;

  let entries: string[];
  try {
    entries = fs.readdirSync(dir);
  } catch {
    return null;
  }

  for (const signal of SIGNALS) {
    const matched = entries.some(e =>
      signal.test instanceof RegExp ? signal.test.test(e) : e === signal.test
    );
    if (matched) return signal.skill;
  }

  const parent = path.dirname(dir);
  return parent !== dir ? detectSkill(parent, depth + 1) : null;
}
// <AI-Generated END>
