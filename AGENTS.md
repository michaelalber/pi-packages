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
       -->

---

## Project Overview

- **Name:** pi-packages
- **Purpose:** Project-type-specific harnesses for the [Pi](https://pi.dev) (Earendil Inc.) coding agent backed by local inference (Ollama on all platforms; MLX-LM on Apple Silicon). Each package ships a skill, prompt templates, TypeScript extensions, and an Ollama Modelfile tuned for its domain.
- **Phase:** Active development — implementing Phase 2 (core packages) through Phase 5 (npm publish + portfolio polish).
- **Definition of success:** Every installed harness loads its skill automatically, calls `search_knowledge` via the RAG extension before generating code, routes tasks to the correct inference endpoint, and stays within the context budget — all without manual configuration.

---

## Technology Stack

- **Agent platform:** Pi (pi.dev) — terminal coding harness with Ollama provider, skill system, TypeScript extensions, and prompt templates
- **Inference backend (Ollama):** GPU-accelerated local inference on Laptop (RTX 3060), PC (RTX 3080), and optionally Mac Mini; port 11434
- **Inference backend (MLX-LM):** Apple Silicon-native inference via `mlx_lm.server` on Mac Mini (M4 Pro, 48 GB unified); port 8080, OpenAI-compatible API. Model IDs use `mlx-community/*` HuggingFace quantized variants. Serves one model at a time — restart to switch.
- **RAG / grounding:** grounded-code-mcp CLI (subprocess via `spawnSync`) — injects authoritative docs into every model call via `search_knowledge` / `search_code_examples`; no MCP server process required
- **Extension language:** TypeScript — all extensions compiled via `tsconfig.json` at repo root
- **Package manager:** npm workspaces — root `package.json` manages all six sub-packages
- **Distribution:** `pi install git:codeberg.org/malber/pi-packages/packages/pi-<type>` (dev) or `npm:@malber/pi-<type>` (post-publish)
- **Remote inference:** Tailscale MagicDNS — `mac-mini` resolves on LAN and VPN without IP changes

---

## Architecture

- **Pattern:** npm monorepo — one root workspace with six peer packages (`pi-dotnet`, `pi-php`, `pi-python`, `pi-robotics`, `pi-industrial`, `pi-rust`)
- **Shared vs. package-level:**
  - `shared/extensions/` — canonical source for all four TypeScript extensions (rag, router, budget, project-detect); packages symlink in
  - `shared/prompts/` — base prompt templates; packages may override per-domain
  - `shared/models/` — five model definition files: List A (Ollama), List B (Ollama), Tailscale Ollama override, MLX-LM Mac Mini, Tailscale MLX-LM override
  - `shared/types/pi.d.ts` — Pi ExtensionAPI TypeScript declarations
- **Key directories:**
  - `packages/pi-<type>/skills/<type>.md` — skill invariants and grounded-code collection map
  - `packages/pi-<type>/prompts/` — eight prompt templates: fix, review, generate, explain, decompose, red, green, refactor
  - `packages/pi-<type>/extensions/` — symlinks to `shared/extensions/`
  - `packages/pi-<type>/modelfiles/<type>.Modelfile` — Ollama convenience wrapper (temperature 0.15, num_ctx); behavior rules are authoritative in `skills/<type>.md`
  - `scripts/prepublish.js` — resolves symlinks before npm publish
- **Routing logic:** `extensions/router.ts` switches models by message length — < 150 tokens stays local, 150–500 → PC, 500+ → Mac Mini
- **Context budget:** `extensions/budget.ts` monitors token usage and triggers Pi auto-compact at 80% capacity

---

## Key Files

| File | Why It Matters |
|---|---|
| `shared/extensions/rag.ts` | Registers `search_knowledge` and `search_code_examples` tools — the RAG first-step pattern every skill depends on |
| `shared/extensions/router.ts` | Automatic PC / Mac Mini model routing by task complexity |
| `shared/extensions/budget.ts` | Context window guard — prevents runaway inference costs and quality degradation |
| `shared/extensions/project-detect.ts` | Auto-loads the right skill by detecting project signals (`.csproj`, `composer.json`, `pyproject.toml`, etc.) |
| `packages/pi-dotnet/skills/dotnet.md` | Gold standard for skill authoring — highest-priority package (PSMD project) |
| `shared/models/models-mac-mini-mlx.json` | MLX-LM Mac Mini model entries — mirrors mac-mini IDs from List A/B with `provider: mlx-lm` and port 8080 |
| `shared/models/models-remote-mlx.json` | Tailscale VPN overrides for MLX-LM Mac Mini |
| `shared/models/router-config.example.json` | Template for `~/.pi/agent/router-config.json` — user sets `medium` and `complex` model IDs for the router extension |
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
| 2026-06-04 | MLX-LM model entries use the same `id` values as Ollama entries | Router extension and Pi model references stay stable; only `provider`, `baseUrl`, and `model` differ between backends |
| 2026-06-04 | MLX-LM files are peer supplements, not replacements for existing model files | Ollama users touch nothing; Apple Silicon users swap in (or merge in) the MLX files |
| 2026-06-04 | Skill files are the authoritative source for behavior rules; Modelfiles are Ollama-only convenience wrappers | MLX-LM has no Modelfile equivalent — system prompts must live in the skill file to be backend-agnostic |
| 2026-06-07 | TDD phase templates (red/green/refactor) added to `shared/prompts/` and all six packages | Phase-locked templates are invoked on demand — zero always-on token cost. They externalize RGR discipline into the prompt structure so the model doesn't need to maintain it across turns. Global AGENTS.md already states RGR; templates make each phase an explicit invocation target. |

---

## Open Loops

- [x] Phase 2 core packages — all five packages implemented (`pi-dotnet`, `pi-python`, `pi-php`, `pi-robotics`, `pi-industrial`); `pi-rust` added as sixth package
- [x] Modelfiles — all six written with temperature 0.15, num_ctx, and full system prompts; behavior rules migrated to skill files as authoritative source
- [ ] MLX-LM: `mlx_lm.server` serves one model at a time — no multi-model routing equivalent to Ollama; router extension always uses the currently-running model on port 8080
- [x] Phase 4 benchmarks — `ai-tools/benchmarks/eval_runner.py`, 20-question eval sets per project type, and unit tests written; run with `uvx pytest` (tests) and `python3 ai-tools/benchmarks/eval_runner.py --package <name>` (live Ollama run)
- [ ] npm publish workflow — `scripts/prepublish.js` exists but packages have not been published; needs scoped npm account `@malber`

---

## Team

| Name | Role | Notes |
|---|---|---|
| Michael K. Alber | Owner / Primary contributor | All changes reviewed before merge |

---

## Project Boot Ritual

Follow the global Session Boot Ritual (see global `CLAUDE.md` / `AGENTS.md`). Repo-specific deltas:
read this file plus `intent.md` and `constraints.md` before starting. Confirm **Persistent Decisions** and **Open Loops** above. The grounded-code-mcp
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

## Output format
- Code only in fenced code blocks
- One file per block, filename as the block label
- <test framework> test file before production file
- Never output preamble or trailing summaries

## grounded-code collections for this project type
- <collection-suffix> — <what it contains>
```

The `## Output format` section is the authoritative substitute for the Modelfile `OUTPUT FORMAT` block. It ensures MLX-LM users (who receive no baked-in system prompt) get the same output conventions as Ollama users.

### Prompt Templates

Eight templates in `prompts/`: `fix.md`, `review.md`, `generate.md`, `explain.md`, `decompose.md`, `red.md`, `green.md`, `refactor.md`.
Packages may override the base templates in `shared/prompts/` with domain-specific context.
Keep templates under 300 tokens — local models waste context on format overhead.

The three TDD phase templates (`red`, `green`, `refactor`) are explicit entry points for the Red→Green→Refactor cycle. They lock each phase so the model cannot conflate them. Use them as: `/red <behavior>` → review → `/green` → review → `/refactor`. Package overrides add the domain-specific test runner command (`dotnet test`, `pytest -v`, `php artisan test`, `cargo test`) and any safety constraints (robotics, industrial).

### Modelfile

Ollama-only convenience wrapper. The `SYSTEM` block should mirror the skill's invariants condensed to < 300 tokens. **Behavior rules are authoritative in `skills/<type>.md`** — the Modelfile bakes them in for Ollama users; MLX-LM users receive them via Pi's skill injection path instead.

```
# NOTE: SYSTEM prompt content is authoritative in packages/pi-<type>/skills/<type>.md
#       This file is an Ollama convenience wrapper only.
#       MLX-LM users: see shared/models/models-mac-mini-mlx.json
FROM <base-model>
PARAMETER temperature 0.15
PARAMETER top_p 0.9
PARAMETER top_k 40
PARAMETER repeat_penalty 1.1
PARAMETER num_ctx <32768 for Mac Mini, 8192 for PC/Laptop>
PARAMETER num_predict 2048
SYSTEM """<condensed invariants from skills/<type>.md>"""
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
- When modifying a shared extension, test that all six packages still type-check: `npm run lint`.
- Keep skills under 500 tokens total — local models have less tolerance for long instructions than cloud models.
- Never add `require()` or `import` in extensions beyond what Pi's extension sandbox provides.
- When adding a new package, follow the steps in `README.md § Add a new project-type package` exactly.
- Publish workflow: use `node scripts/prepublish.js <package-name>` — never `npm publish` directly; symlinks must be resolved first.
