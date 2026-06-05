# pi-packages — Intent
<!-- Discipline 3: Intent Engineering (v2026.03.2)
     Framework: Four Prompt Disciplines & Five Primitives (Nate B. Jones)

     PROJECT-LEVEL FILE — supplements the global CLAUDE.md and AGENTS.md.
     This file tells the agent what to OPTIMIZE FOR when working on this repository.
     Project context (what to know) lives in the root AGENTS.md. -->

---

## Agent Architecture

**This project uses:** Coding harness

**Reason:** Contributors work task-by-task with human review at each step. Pi packages are
discrete, independently testable units — no multi-session autonomous execution is needed.
Each package ships a skill, extensions, prompts, and a Modelfile that together form one
coherent harness.

---

## Primary Goal

Enable developers to run a high-quality, local AI coding harness for their project type
using Ollama inference — achieving 75%+ local coverage without sacrificing response quality
or requiring cloud API keys.

---

## Values (What We Optimize For)

1. **Quality** — every skill must produce correct, grounded output; RAG is mandatory, not optional
2. **Correctness** — local models fail silently when instructions are vague; precision and brevity beat completeness
3. **Usability** — a developer should install a package and get working harness behavior without reading docs
4. **Consistency** — all five project-type packages follow the same structure; no one-offs
5. **Speed of delivery** — lowest priority; never trade quality or usability for it

---

## Tradeoff Rules

| Conflict | Resolution |
|---|---|
| Speed vs. quality | Quality wins. A harness that ships fast but produces hallucinated APIs is worse than no harness. |
| Token count vs. completeness | Token budget wins. Skills must stay under 500 tokens; depth belongs in referenced docs, not the skill body. |
| Shared vs. per-package extension | Shared wins unless a package genuinely needs different behavior. Divergence multiplies maintenance cost. |
| New package vs. fixing existing | Fix existing first. A broken RAG call in `pi-dotnet` has immediate project impact; `pi-industrial` stubs can wait. |
| Best-model vs. US/EU-only | Never embed this decision in code. Keep List A and List B as separate model files; let the user choose. |

---

## Decision Boundaries

### Decide Autonomously

- Wording and structure within a skill file (as long as token budget is respected)
- Which grounded-code collections to map for a project type
- Prompt template phrasing within the five templates
- Modelfile parameter values within the architecture-specified ranges

### Escalate to Human

- Adding a sixth project-type package not currently represented
- Changing the router threshold values (150 / 500 tokens) — affects all machines
- Changing the shared extension API surface in `shared/types/pi.d.ts`
- Any npm publish action — packages are public once published
- Changes to `shared/models/*.json` that alter model IDs or baseUrls
- Decisions that affect `ARCHITECTURE.md` — it is the single source of truth for system design

---

## What "Good" Looks Like

A good output for this project:

- A skill file that is < 500 tokens, forces RAG as step 1, lists non-negotiable invariants,
  and maps all relevant grounded-code collections
- A prompt template that is < 300 tokens and uses structured output to constrain the model's response shape
- A Modelfile with temperature 0.15, appropriate num_ctx for the target machine tier, and a system prompt stub that matches the skill
- A shared extension change that type-checks cleanly with `npm run lint` and is validated in at least one package

---

## Anti-Patterns (What Bad Looks Like)

- A skill that exceeds 500 tokens by padding with philosophy instead of actionable rules
- A skill that omits the RAG step or makes it optional ("if you need context, call…")
- A prompt template that says "write good code" without constraining output shape
- A Modelfile with temperature 0.0 (eliminates all variation, causes repetition loops) or temperature > 0.3 (too creative for code)
- An extension that calls a Pi API method not declared in `shared/types/pi.d.ts`
- A package published to npm with unresolved symlinks (symlinks break on npm install)
- Model IDs hardcoded in extension logic instead of read from `models.json`
- A new package added without updating `project-detect.ts` (auto-loading breaks for that project type)

---

## Persistent Decisions

<!-- Architectural and product decisions that are settled — agent must not re-litigate them.
     Canonical list lives in AGENTS.md. Add entries there; cross-reference here only if
     a decision directly affects intent or tradeoff resolution. -->

See `AGENTS.md` § Persistent Decisions.

---

## Open Loops

<!-- Unresolved questions the agent should surface proactively.
     Canonical list lives in AGENTS.md. -->

See `AGENTS.md` § Open Loops.
