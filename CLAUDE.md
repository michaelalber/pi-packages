# CLAUDE.md — pi-packages

See [AGENTS.md](AGENTS.md) for full project conventions, package structure, skill/extension
templates, and persistent decisions.

---

## Quick Reference

- **Skills:** `packages/pi-<type>/skills/<type>.md` — < 500 tokens, RAG-first, invariants + collection map
- **Prompt templates:** `packages/pi-<type>/prompts/` — 8 files (fix / review / generate / explain / decompose / red / green / refactor); base templates in `shared/prompts/`
- **Extensions:** `packages/pi-<type>/extensions/` — symlinks to `shared/extensions/` (rag, router, budget, project-detect)
- **Modelfiles:** `packages/pi-<type>/modelfiles/<type>.Modelfile` — Ollama-only convenience wrapper; behavior rules are authoritative in the skill file
- **Types:** `shared/types/pi.d.ts` — Pi ExtensionAPI declarations; read before editing any extension
- **Models (Ollama):** `shared/models/models-us-eu.json` (List A), `models-best.json` (List B), `models-remote.json` (Tailscale)
- **Models (MLX-LM):** `shared/models/models-mac-mini-mlx.json` (Apple Silicon Mac Mini), `models-remote-mlx.json` (Tailscale)

---

## Contributor Validation

```bash
# Type-check all extensions
npm run lint

# Verify a package has all required files
ls packages/pi-dotnet/{skills,prompts,extensions,modelfiles}

# Confirm symlinks resolve correctly in a package
ls -la packages/pi-dotnet/extensions/

# Check extension API usage is valid (no invented methods)
grep -r "pi\." packages/pi-dotnet/extensions/ | head -20
```

---

## When Adding a Skill

1. Copy the gold standard: `packages/pi-dotnet/skills/dotnet.md`
2. Keep total token count < 500 — precision beats comprehensiveness for local models
3. Structure: Before writing code (RAG calls) → Invariants → Task approach → Quality gates → **Output format** → Collection map
4. The `## Output format` section is required — it is the authoritative source for output conventions for both Ollama and MLX-LM users
5. Map all grounded-code collections the project type needs (see `AGENTS.md § grounded-code Collection Map`)

## When Adding a Package

Follow `README.md § Add a new project-type package` exactly:
1. Create directory structure
2. Write skill (including `## Output format` section), prompt templates, Modelfile
3. Symlink `shared/extensions/` into `packages/pi-<type>/extensions/`
4. Add project-type signals to `shared/extensions/project-detect.ts`
5. Run `npm run lint` — must pass before commit

Prompt templates required: fix, review, generate, explain, decompose, red, green, refactor (8 total).
Copy from `shared/prompts/` and override with the domain-specific test runner and any safety constraints.

The Modelfile is Ollama-only. MLX-LM users get behavior rules from the skill file — no additional file needed.

## When Modifying a Shared Extension

Shared extensions affect all six packages. After any change:
- Run `npm run lint` (type-check)
- Manually test the affected extension in at least one package
- Note the change in the Open Loops section of `AGENTS.md` if it is not yet fully validated

## Publish Workflow

```bash
# Always use prepublish.js — never npm publish directly
node scripts/prepublish.js pi-dotnet
node scripts/prepublish.js pi-php
node scripts/prepublish.js pi-python
node scripts/prepublish.js pi-robotics
node scripts/prepublish.js pi-industrial
node scripts/prepublish.js pi-rust
```

`prepublish.js` resolves symlinks before publishing and restores them after. Bypassing it
will publish broken symlinks to npm.
