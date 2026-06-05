# CLAUDE.md — pi-packages

See [AGENTS.md](AGENTS.md) for full project conventions, package structure, skill/extension
templates, and persistent decisions.

---

## Quick Reference

- **Skills:** `packages/pi-<type>/skills/<type>.md` — < 500 tokens, RAG-first, invariants + collection map
- **Prompt templates:** `packages/pi-<type>/prompts/` — 5 files (fix / review / generate / explain / decompose); base templates in `shared/prompts/`
- **Extensions:** `packages/pi-<type>/extensions/` — symlinks to `shared/extensions/` (rag, router, budget, project-detect)
- **Modelfiles:** `packages/pi-<type>/modelfiles/<type>.Modelfile` — temperature 0.15, num_ctx per machine tier
- **Types:** `shared/types/pi.d.ts` — Pi ExtensionAPI declarations; read before editing any extension
- **Models:** `shared/models/models-us-eu.json` (List A), `models-best.json` (List B), `models-remote.json` (Tailscale)

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
3. Structure: Before writing code (RAG calls) → Invariants → Task approach → Quality gates → Collection map
4. Map all grounded-code collections the project type needs (see `AGENTS.md § grounded-code Collection Map`)

## When Adding a Package

Follow `README.md § Add a new project-type package` exactly:
1. Create directory structure
2. Write skill, prompt templates, Modelfile
3. Symlink `shared/extensions/` into `packages/pi-<type>/extensions/`
4. Add project-type signals to `shared/extensions/project-detect.ts`
5. Run `npm run lint` — must pass before commit

## When Modifying a Shared Extension

Shared extensions affect all five packages. After any change:
- Run `npm run lint` (type-check)
- Manually test the affected extension in at least one package
- Note the change in the Open Loops section of `AGENTS.md` if it is not yet fully validated

## Publish Workflow

```bash
# Always use prepublish.js — never npm publish directly
node scripts/prepublish.js pi-dotnet
node scripts/prepublish.js pi-php
# etc.
```

`prepublish.js` resolves symlinks before publishing and restores them after. Bypassing it
will publish broken symlinks to npm.
