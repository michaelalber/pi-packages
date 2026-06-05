# pi-packages — Constraints
<!-- Discipline 4: Specification Engineering — Primitive 3: Constraint Architecture
     Framework: Four Prompt Disciplines & Five Primitives (Nate B. Jones, v2026.03.2)

     PROJECT-LEVEL FILE — supplements the global CLAUDE.md and AGENTS.md.
     Global standards (security, commit format, code quality) apply unconditionally.
     This file adds constraints specific to contributing to this repository. -->

---

## Must Do

- Read `AGENTS.md` (root), `intent.md`, and this file before beginning any task.
- Keep skill files under 500 tokens total — measure before committing.
- Keep prompt templates under 300 tokens — local models pay a quality penalty for long instructions.
- Include `search_knowledge` as step 1 in every skill, before any code generation — it is mandatory, not optional.
- Run `npm run lint` (TypeScript type-check) after every extension change before committing.
- When modifying any shared extension in `shared/extensions/`, verify behavior in at least one package before committing.
- Use `node scripts/prepublish.js <package-name>` for npm publish — never `npm publish` directly.
- Keep symlinks in `packages/pi-<type>/extensions/` pointing to `shared/extensions/` — do not copy the files.
- When adding a new package, update `shared/extensions/project-detect.ts` with the new project-type signals.
- Map grounded-code collections explicitly in each skill — do not leave the collection map section empty.

---

## Must NOT Do

- Do not exceed 500 tokens in a skill file. Long skills degrade local model output quality.
- Do not make the RAG step optional ("if you need context…") — it is always required.
- Do not hardcode model IDs or baseUrls in extension logic — read from `models.json`.
- Do not use `npm publish` directly — unresolved symlinks will break the published package.
- Do not call Pi ExtensionAPI methods not declared in `shared/types/pi.d.ts` — they will silently fail at runtime.
- Do not set Modelfile temperature to 0.0 (causes repetition loops) or above 0.3 (too creative for code generation).
- Do not add a new project-type package without a corresponding entry in `project-detect.ts`.
- Do not change router threshold values (150 / 500 tokens) without explicit human approval — they affect all machines.
- Do not embed model origin policy (US/EU vs. best overall) in code — keep it in the separate model JSON files.
- Do not modify `ARCHITECTURE.md` without explicit human approval — it is the single source of truth for system design decisions.
- Do not leave TODO comments in committed files — either implement it or mark `[CANNOT COMPLETE]`.

---

## Preferences

- Prefer editing an existing skill over adding new sections when a gap can be closed with a single line.
- Prefer adding to `shared/prompts/` over duplicating templates across packages when the content is domain-agnostic.
- Prefer the grounded-code-mcp knowledge base over training data for framework APIs and security patterns.
- When both the skill and the Modelfile system prompt need updating, update them in the same commit.
- Prefer explicit collection names in skills over relying on the model to guess which collection to search.

---

## Escalate Rather Than Decide

- Any proposal to add a seventh project-type package not currently in `AGENTS.md`.
- Changes to router threshold values (150 / 500 tokens in `shared/extensions/router.ts`).
- Changes to the Pi ExtensionAPI surface (`shared/types/pi.d.ts`) — affects all extensions.
- Any npm publish action — packages are public after publish.
- Changes to `shared/models/*.json` model IDs or baseUrls — affects every machine running the harness.
- Any decision to diverge from the shared extension pattern (i.e., giving one package its own non-symlinked copy of an extension).
- Changes to `ARCHITECTURE.md` — escalate even minor wording changes to preserve it as the authoritative design document.

---

## File Architecture Constraints

| Location | Purpose | Token budget |
|---|---|---|
| `packages/pi-<type>/skills/<type>.md` | Skill: invariants + RAG step + collection map | < 500 tokens |
| `packages/pi-<type>/prompts/*.md` | Prompt templates (5 per package) | < 300 tokens each |
| `packages/pi-<type>/modelfiles/<type>.Modelfile` | Ollama config: temperature, num_ctx, system prompt stub | No strict limit; keep system prompt < 200 tokens |
| `shared/extensions/*.ts` | Shared TypeScript extensions | Must type-check via `npm run lint` |
| `shared/types/pi.d.ts` | Pi ExtensionAPI declarations | Source of truth — do not diverge |
| `shared/prompts/*.md` | Base prompt templates | < 300 tokens each |
| `shared/models/*.json` | Model configuration per tier/list | No logic — data only |

- Skill files are project context for the model, not documentation for humans — every token must earn its place.
- Prompt templates are invoked directly by users — they must work standalone without requiring the user to know the skill contents.
- Modelfiles are registered with Ollama once and rarely changed — validate locally before committing.
