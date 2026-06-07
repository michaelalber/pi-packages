// <AI-Generated START>
// Detects project type from filesystem signals and injects the matching skill.
// Walks up to 3 parent directories from cwd before giving up.
// Uses resources_discover (Pi v0.78+) — ctx.loadSkill was removed in this version.

import * as fs from "fs";
import * as path from "path";

interface Signal {
  test: string | RegExp;
  skill: string;
}

// __dirname resolves to the real file (jiti follows symlinks): shared/extensions/
// Skill files live at ../../packages/<pkg>/skills/<name>.md
const PACKAGES_ROOT = path.resolve(__dirname, "../../packages");

const SKILL_PATHS: Record<string, string> = {
  dotnet:     path.join(PACKAGES_ROOT, "pi-dotnet/skills/dotnet.md"),
  php:        path.join(PACKAGES_ROOT, "pi-php/skills/php.md"),
  python:     path.join(PACKAGES_ROOT, "pi-python/skills/python.md"),
  robotics:   path.join(PACKAGES_ROOT, "pi-robotics/skills/robotics.md"),
  industrial: path.join(PACKAGES_ROOT, "pi-industrial/skills/industrial.md"),
  rust:       path.join(PACKAGES_ROOT, "pi-rust/skills/rust.md"),
};

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
  pi.on("resources_discover", async (event, _ctx) => {
    const cwd = (event as { cwd?: string }).cwd ?? process.cwd();
    const detected = detectSkill(cwd, 0);

    if (!detected) return undefined;

    const skillPath = SKILL_PATHS[detected];
    if (!skillPath || !fs.existsSync(skillPath)) return undefined;

    return { skillPaths: [skillPath] };
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
