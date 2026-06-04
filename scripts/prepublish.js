#!/usr/bin/env node
// Resolves symlinks in packages/<name>/extensions/ before npm publish,
// then restores them after. npm publish does not follow symlinks.
//
// Usage: node scripts/prepublish.js <package-name>
//   e.g. node scripts/prepublish.js pi-dotnet

import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const pkgName = process.argv[2];

if (!pkgName) {
  console.error("Usage: node scripts/prepublish.js <package-name>");
  process.exit(1);
}

const extDir = path.join(root, "packages", pkgName, "extensions");

if (!fs.existsSync(extDir)) {
  console.log(`No extensions/ directory for ${pkgName} — skipping.`);
  process.exit(0);
}

const resolved = [];

for (const entry of fs.readdirSync(extDir)) {
  const linkPath = path.join(extDir, entry);
  if (fs.lstatSync(linkPath).isSymbolicLink()) {
    const realPath = fs.realpathSync(linkPath);
    const content = fs.readFileSync(realPath, "utf8");
    fs.unlinkSync(linkPath);
    fs.writeFileSync(linkPath, content, "utf8");
    resolved.push({ linkPath, realPath });
    console.log(`  resolved: ${entry}`);
  }
}

const result = spawnSync("npm", ["publish", "--access", "public"], {
  cwd: path.join(root, "packages", pkgName),
  stdio: "inherit"
});

// Restore symlinks regardless of publish result
for (const { linkPath, realPath } of resolved) {
  const rel = path.relative(path.dirname(linkPath), realPath);
  fs.unlinkSync(linkPath);
  fs.symlinkSync(rel, linkPath);
  console.log(`  restored: ${path.basename(linkPath)}`);
}

process.exit(result.status ?? 1);
