# pi-packages — Project Context
<!-- ⚠ PROJECT-LEVEL FILE — NOT GLOBAL
     This is the project-level AGENTS.md for OpenCode and Pi.
     It supplements your global opencode/global/AGENTS.md — it does NOT replace it.
     Global standards (coding style, security rules, quality gates) live in the global file.
     This file contains only what is specific to THIS repository.

     DISCIPLINE 2: Context Engineering — scoped to this project.
     Tells the agent everything it needs to KNOW about this repo.

     RELATED FILES:
       intent.md       — what the agent should optimize for (goals, values, tradeoff hierarchy)
       constraints.md  — musts, must-nots, preferences, escalation triggers
       ARCHITECTURE.md — full system design, hardware matrix, model recommendations, phases -->

---

## Project Overview

- **Name:** pi-packages
- **Purpose:** Project-type-specific harnesses for the [Pi](https://pi.dev) (Earendil Inc.) coding agent backed by Ollama local inference. Each package ships a skill, prompt templates, TypeScript extensions, and an Ollama Modelfile tuned for its domain.
- **Phase:** Active development — implementing Phase 2 (core packages) through Phase 5 (npm publish + portfolio polish). See `ARCHITECTURE.md § 9 Implementation Phases`.
- **Definition of success:** Every installed harness loads its skill automatically, calls `search_knowledge` via the RAG extension before generating code, routes tasks to the correct inference endpoint, and stays within the context budget — all without manual configuration.

---

## Technology Stack

- **Agent platform:** Pi (pi.dev) — terminal coding harness with Ollama provider, skill system, TypeScript extensions, and prompt templates
- **Inference backend:** Ollama (local) — GPU-accelerated models on Laptop (RTX 3060), PC (RTX 3080), and Mac Mini (Apple Silicon 48 GB)
- **RAG / grounding:** grounded-code-mcp (local MCP server) — injects authoritative docs into every model call via `search_knowledge` / `search_code_examples`
- **Extension language:** TypeScript — all extensions compiled via `tsconfig.json` at repo root
- **Package manager:** npm workspaces — root `package.json` manages all five sub-packages
- **Distribution:** `pi install git:codeberg.org/malber/pi-packages/packages/pi-<type>` (dev) or `npm:@malber/pi-<type>` (post-publish)
- **Remote inference:** Tailscale MagicDNS — `mac-mini` resolves on LAN and VPN without IP changes

---

## Architecture

- **Pattern:** npm monorepo — one root workspace with five peer packages (`pi-dotnet`, `pi-php`, `pi-python`, `pi-robotics`, `pi-industrial`)
- **Shared vs. package-level:**
  - `shared/extensions/` — canonical source for all four TypeScript extensions (rag, router, budget, project-detect); packages symlink in
  - `shared/prompts/` — base prompt templates; packages may override per-domain
  - `shared/models/` — three model definition files (List A, List B, remote overrides)
  - `shared/types/pi.d.ts` — Pi ExtensionAPI TypeScript declarations
- **Key directories:**
  - `packages/pi-<type>/skills/<type>.md` — skill invariants and grounded-code collection map
  - `packages/pi-<type>/prompts/` — five prompt templates: fix, review, generate, explain, decompose
  - `packages/pi-<type>/extensions/` — symlinks to `shared/extensions/`
  - `packages/pi-<type>/modelfiles/<type>.Modelfile` — Ollama Modelfile (temperature 0.15, num_ctx, system prompt stub)
  - `scripts/prepublish.js` — resolves symlinks before npm publish
- **Routing logic:** `extensions/router.ts` switches models by message length — < 150 tokens stays local, 150–500 → PC, 500+ → Mac Mini
- **Context budget:** `extensions/budget.ts` monitors token usage and triggers Pi auto-compact at 80% capacity

---

## Key Files

| File | Why It Matters |
|---|---|
| `ARCHITECTURE.md` | Full system design, hardware/model matrix, harness quality strategies, and phased implementation plan |
| `shared/extensions/rag.ts` | Registers `search_knowledge` and `search_code_examples` tools — the RAG first-step pattern every skill depends on |
| `shared/extensions/router.ts` | Automatic PC / Mac Mini model routing by task complexity |
| `shared/extensions/budget.ts` | Context window guard — prevents runaway inference costs and quality degradation |
| `shared/extensions/project-detect.ts` | Auto-loads the right skill by detecting project signals (`.csproj`, `composer.json`, `pyproject.toml`, etc.) |
| `packages/pi-dotnet/skills/dotnet.md` | Gold standard for skill authoring — highest-priority package (PSMD project) |
| `shared/types/pi.d.ts` | Pi ExtensionAPI declarations — read before modifying any extension |
| `intent.md` | Goals, values, tradeoff hierarchy, and persistent decisions for this repo |
| `constraints.md` | Contribution constraints — read before any task |

---

## Global Harness Rules (Pi context — loaded from `~/.pi/agent/AGENTS.md`)

When installed, `AGENTS.md` lands at `~/.pi/agent/AGENTS.md` and Pi loads it on every session.
These are the minimal rules every project-type harness inherits:

**Code quality**
- Write only what was asked. No preamble, no trailing summaries.
- Mark all generated code: `// <AI-Generated START>` … `// <AI-Generated END>`
- If uncertain: `[CANNOT COMPLETE: <reason>]` — never hallucinate APIs or method signatures
- Tests before production code, always

**Context**
- Call `search_knowledge` before generating any unfamiliar pattern
- Call `search_code_examples` for implementation examples
- Read existing code before writing — match conventions exactly

**Task approach**
- Single function: generate directly
- 2+ files: decompose first, confirm, execute one file at a time
- Open-ended design: reason through options, present a recommendation with tradeoffs

**Security**
- Parameterized queries only — no string-concatenated SQL under any circumstances
- Never log passwords, tokens, or PII
- Validate all inputs at system boundaries

**Output**
- One file per fenced code block, filename as block label
- No TODO comments — either implement it or mark `[CANNOT COMPLETE]`

---

## Persistent Decisions

| Date | Decision | Rationale |
|---|---|---|
| 2026-06-04 | Shared extensions are the canonical source; packages symlink in | Single-source for bug fixes; `prepublish.js` resolves symlinks before npm publish |
| 2026-06-04 | System prompts capped at < 400 tokens | Local models degrade on long, vague instructions; precision beats comprehensiveness |
| 2026-06-04 | Temperature 0.15 in all Modelfiles (not 0.0) | Slight variation prevents repetition loops while keeping code deterministic |
| 2026-06-04 | RAG is a required first step in every skill | Substitutes unreliable model training memory with authoritative grounded-code-mcp content |
| 2026-06-04 | Router threshold: 150 / 500 tokens for Laptop → PC → Mac Mini | Matches observed model capability ceilings: 7B for inline, 13B for small features, 22B+ for architecture |
| 2026-06-04 | grounded-code-mcp is optional at install but strongly recommended | Graceful degradation: `search_knowledge` returns empty if MCP is absent; model falls back to training data |
| 2026-06-04 | List A (US/EU) and List B (best overall) are separate model files, not flags | Different clients have different origin constraints; keeping files separate avoids conditional logic at runtime |

---

## Open Loops

- [ ] Phase 2 core packages — `pi-dotnet` is the priority (active PSMD project); remaining four in order: `pi-python`, `pi-php`, `pi-robotics`, `pi-industrial`
- [ ] `shared/extensions/project-detect.ts` — needs project signals for all five project types before Phase 2 is complete
- [ ] Phase 3 Modelfiles — all five are stubs; need temperature/num_ctx tuning per model tier after Phase 2 baseline is working
- [ ] Phase 4 benchmarks — `ai-tools/benchmarks/eval_runner.py` and 20-question eval sets per project type not yet written
- [ ] npm publish workflow — `scripts/prepublish.js` exists but packages have not been published; needs scoped npm account `@malber`
- [ ] Pi skill for `pi-industrial` — content is mostly stubs; needs MODBUS/OPC UA/IEC 61131-3 invariants

---

## Team

| Name | Role | Notes |
|---|---|---|
| Michael K. Alber | Owner / Primary contributor | All changes reviewed before merge |

---

## Project Boot Ritual

Follow the global Session Boot Ritual (see global `CLAUDE.md` / `AGENTS.md`). Repo-specific deltas:
read this file plus `intent.md`, `constraints.md`, and `ARCHITECTURE.md § 9` (implementation phases)
before starting. Confirm **Persistent Decisions** and **Open Loops** above. The grounded-code-mcp
workflow (search_knowledge / search_code_examples) is defined globally — not repeated here.

---

## Package Conventions

### Skill File (`skills/<type>.md`)

Each skill follows this structure (< 500 tokens total):

```markdown
# <type>
Use this skill when working on <project-type description>.

## Before writing any code
1. Call search_knowledge("<domain> {pattern}", collection="<primary>")
2. Call search_code_examples("{pattern}", language="<lang>")
3. Use returned patterns — never invent method signatures or library APIs

## Invariants
- <language/framework non-negotiables, one per line>

## Task approach
- Single function or property: generate directly
- Feature touching 2+ files: list steps, confirm, execute one file at a time
- Any uncertainty about an API: [CANNOT COMPLETE: <reason>] — never guess

## Quality gates
- <measurable thresholds>

## grounded-code collections for this project type
- <collection-suffix> — <what it contains>
```

### Prompt Templates

Five templates in `prompts/`: `fix.md`, `review.md`, `generate.md`, `explain.md`, `decompose.md`.
Packages may override the base templates in `shared/prompts/` with domain-specific context.
Keep templates under 300 tokens — local models waste context on format overhead.

### Modelfile

```
FROM <base-model>
PARAMETER temperature 0.15
PARAMETER top_p 0.9
PARAMETER top_k 40
PARAMETER repeat_penalty 1.1
PARAMETER num_ctx <32768 for Mac Mini, 8192 for PC/Laptop>
PARAMETER num_predict 2048
SYSTEM """<skill system prompt stub — copied from the skill file>"""
```

### grounded-code Collection Map

| Project Type | Primary | Secondary |
|---|---|---|
| `.NET / SQL / React` | `dotnet`, `databases` | `javascript`, `patterns`, `internal` |
| `PHP / Laravel / VueJS` | `php`, `javascript` | `patterns`, `internal` |
| `Python` | `python` | `patterns`, `internal`, `databases` |
| `Robotics` | `robotics`, `edge_ai` | `automation`, `systems_thinking` |
| `Industrial Automation` | `automation` | `systems_thinking`, `gov` |

---

## Editing Guidelines

- Read `shared/types/pi.d.ts` before modifying any extension — the ExtensionAPI surface is the contract.
- When modifying a shared extension, test that all five packages still type-check: `npm run lint`.
- Keep skills under 500 tokens total — local models have less tolerance for long instructions than cloud models.
- Never add `require()` or `import` in extensions beyond what Pi's extension sandbox provides.
- When adding a new package, follow the steps in `README.md § Add a new project-type package` exactly.
- Publish workflow: use `node scripts/prepublish.js <package-name>` — never `npm publish` directly; symlinks must be resolved first.
