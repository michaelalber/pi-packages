# Local AI Coding Harness — Architecture & Implementation Plan

> **Goal:** Build project-type-specific Pi (pi.dev) harnesses backed by Ollama local models,
> achieving 75%+ local inference coverage without sacrificing response quality.
> Two public repos drive the system: `pi-packages` (harnesses) and `ai-tools` (infrastructure).

---

## Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [Hardware & Routing](#2-hardware--routing)
3. [Model Recommendations](#3-model-recommendations)
   - [List A — US/EU Only](#list-a--useu-only-for-restricted-clients)
   - [List B — Best Overall](#list-b--best-overall-regardless-of-origin)
   - [Recommended Stacks by List](#recommended-stacks-by-list)
4. [Model-to-Project-Type Matrix](#4-model-to-project-type-matrix)
5. [Harness Quality Strategies](#5-harness-quality-strategies)
6. [Pi Agent Integration](#6-pi-agent-integration)
7. [Repository Architecture](#7-repository-architecture)
   - [pi-packages](#pi-packages-repo)
   - [ai-tools](#ai-tools-repo)
8. [Key Configurations](#8-key-configurations)
   - [models.json](#modelsjson)
   - [AGENTS.md (global)](#agentsmd-global)
   - [Extension: rag.ts](#extension-ragts)
   - [Extension: router.ts](#extension-routerts)
   - [Skill: dotnet.md (full draft)](#skill-dotnetmd-full-draft)
9. [Implementation Phases](#9-implementation-phases)
10. [Network Setup](#10-network-setup)

---

## 1. Platform Overview

| Component | Technology | Purpose |
|---|---|---|
| **Coding agent** | [Pi](https://pi.dev) by Earendil Inc. | Terminal coding harness; replaces cloud CLI for local work |
| **Local inference** | [Ollama](https://ollama.com) | Runs models on local hardware |
| **RAG / grounding** | `grounded-code-mcp` (local) | Injects authoritative docs into every model call |
| **Harness packages** | `pi-packages` (this repo) | Skills, extensions, prompts, Modelfiles per project type |
| **Infrastructure** | `ai-tools` repo | Setup scripts, benchmarks, network config |
| **VPN / remote** | Tailscale | Consistent Mac Mini hostname from any network |

### Why Pi

Pi is a minimal, extensible terminal coding agent (MIT license) that:

- **Natively supports Ollama** as a provider alongside Anthropic, OpenAI, Mistral, and 12+ others
- Supports **real-time model switching** — `Ctrl+L` cycles between configured models mid-session
- Loads **AGENTS.md** from project directories for project-specific context (analogous to `CLAUDE.md`)
- Supports **Skills** (Markdown capability packages), **Extensions** (TypeScript tools/events/UI), and **Prompt Templates**
- Distributes packages via `pi install npm:@scope/pkg` or `pi install git:github.com/user/repo`
- Has **auto-compacting** context management with customizable summarization

### Why Ollama

- Single CLI manages model pulls, serving, and API exposure
- OpenAI-compatible API — works with any tool that speaks OpenAI
- Supports GPU offloading on CUDA (PC/Laptop) and Metal (Mac Mini)
- `OLLAMA_HOST=0.0.0.0` exposes the Mac Mini as a network inference server

---

## 2. Hardware & Routing

| Machine | GPU / RAM | VRAM / Context | Model Ceiling | Role |
|---|---|---|---|---|
| **Laptop** | RTX 3060 | 6 GB VRAM | 7B Q4 (~4.5 GB) | On-the-go fast completions |
| **PC** | RTX 3080 | 10 GB VRAM | 13–14B Q4 (~9 GB) | Primary dev completions |
| **Mac Mini** | Apple Silicon | 48 GB unified | 70B Q4 (~40 GB) | Deep reasoning, architecture, review |

### Routing Logic

| Task Type | Signal | Route To |
|---|---|---|
| Inline completion, single function | < 150 tokens, 1 file | Laptop/PC → 7B–8B |
| Bug fix, small feature | 150–500 tokens, 1–3 files | PC → 13B–14B |
| Multi-file feature, refactor | 500+ tokens, 3+ files | Mac Mini → 22B–32B |
| Architecture, design review | Open-ended, no file context | Mac Mini → 70B |

Routing is automatic via `extensions/router.ts` (message length + file count heuristic),
with manual override via `Ctrl+L` model cycling.

---

## 3. Model Recommendations

### List A — US/EU Only (for restricted clients)

| Model | Params | Origin | Context | Best For | Fits Where |
|---|---|---|---|---|---|
| **codestral:22b** | 22B | Mistral 🇫🇷 | 32K | Best EU coding model | Mac Mini |
| **mistral-nemo:12b** | 12B | Mistral 🇫🇷 | 128K | General reasoning + code | Mac Mini, PC Q4 |
| **granite-code:34b** | 34B | IBM 🇺🇸 | 8K | Enterprise: C#, Java, SQL | Mac Mini |
| **granite-code:20b** | 20B | IBM 🇺🇸 | 8K | Mid-tier enterprise code | Mac Mini |
| **granite-code:8b** | 8B | IBM 🇺🇸 | 4K | Fast completions, US-origin | PC, Laptop |
| **granite-code:3b** | 3B | IBM 🇺🇸 | 4K | Inline autocomplete only | Laptop |
| **phi4:14b** | 14B | Microsoft 🇺🇸 | 16K | Reasoning-heavy tasks | PC (tight ~9 GB), Mac Mini |
| **phi3.5:3.8b** | 3.8B | Microsoft 🇺🇸 | 128K | Ultrafast, small footprint | Laptop |
| **llama3.3:70b** | 70B | Meta 🇺🇸 | 128K | Complex architecture, debugging | Mac Mini only (~40 GB Q4) |
| **llama3.1:8b** | 8B | Meta 🇺🇸 | 128K | General coding, long context | PC, Laptop |
| **starcoder2:15b** | 15B | BigCode 🇫🇷🇺🇸 | 16K | Code-focused, fill-in-middle | Mac Mini |
| **starcoder2:7b** | 7B | BigCode 🇫🇷🇺🇸 | 16K | Code completion | PC, Laptop |
| **command-r:35b** | 35B | Cohere 🇨🇦 | 128K | RAG-heavy tasks | Mac Mini |

**Embeddings (US/EU):** `nomic-embed-text` (all machines — fast, neutral origin)

---

### List B — Best Overall (regardless of origin)

All models in List A, plus:

| Model | Params | Origin | Context | Why It Wins |
|---|---|---|---|---|
| **qwen2.5-coder:32b** | 32B | Alibaba 🇨🇳 | 128K | #1 on coding benchmarks across all languages |
| **qwen2.5-coder:14b** | 14B | Alibaba 🇨🇳 | 128K | Best quality that fits PC in Q4 (~9 GB) |
| **qwen2.5-coder:7b** | 7B | Alibaba 🇨🇳 | 128K | Best quality 7B coder for Laptop/PC |
| **deepseek-coder-v2:16b** | 16B | DeepSeek 🇨🇳 | 128K | Strong math + algorithms |

**Embeddings (best quality):** `mxbai-embed-large` on Mac Mini, `nomic-embed-text` on PC/Laptop

---

### Recommended Stacks by List

| Slot | List A (US/EU) | List B (Best Overall) |
|---|---|---|
| **Mac Mini — primary** | `codestral:22b` | `qwen2.5-coder:32b` |
| **Mac Mini — deep** | `llama3.3:70b` | `llama3.3:70b` |
| **PC — primary** | `phi4:14b` (Q4) | `qwen2.5-coder:14b` (Q4) |
| **Laptop — primary** | `granite-code:8b` | `qwen2.5-coder:7b` (Q4) |
| **Mac Mini embeddings** | `nomic-embed-text` | `mxbai-embed-large` |
| **PC/Laptop embeddings** | `nomic-embed-text` | `nomic-embed-text` |

---

## 4. Model-to-Project-Type Matrix

| Project Type | Laptop (6 GB) | PC (10 GB) | Mac Mini (48 GB) | grounded-code collections |
|---|---|---|---|---|
| **.NET / SQL / React** | `granite-code:8b` | `phi4:14b` | `granite-code:34b` | `dotnet`, `databases`, `javascript` |
| **PHP / Laravel / VueJS** | `granite-code:8b` | `phi4:14b` | `codestral:22b` | `php`, `javascript` |
| **Python** | `granite-code:8b` | `phi4:14b` | `qwen2.5-coder:32b` | `python` |
| **Robotics** | `phi3.5:3.8b` | `phi4:14b` | `llama3.3:70b` | `robotics`, `automation`, `edge_ai` |
| **Industrial Automation** | `phi3.5:3.8b` | `phi4:14b` | `llama3.3:70b` | `automation`, `systems_thinking` |

*(Swap `granite-code:*` for `qwen2.5-coder:*` on List B stack.)*

---

## 5. Harness Quality Strategies

Local models fail at three things cloud models absorb easily: **ambiguous instructions**,
**missing context**, and **multi-step reasoning**. The harness fixes all three.

### Strategy 1 — Precision System Prompts (< 500 tokens)

System prompts must be explicit, structured, and short. Local models have less tolerance
for vague instructions and waste context on interpretation.

```
You are a senior {project-type} engineer.

RULES (follow exactly):
1. Write only what was asked. No preamble, no trailing summaries.
2. If uncertain about a library/method: output [CANNOT COMPLETE: <reason>], then continue with what you can.
3. Mark all generated code: // <AI-Generated START> ... // <AI-Generated END>
4. Call search_knowledge before generating any unfamiliar pattern.
5. Match existing conventions exactly — read the provided code before writing.

OUTPUT FORMAT:
- Code only in fenced code blocks
- One file per block, filename as the block label
- Test file before production file
```

Target: < 400 tokens. No philosophy, no hedging.

### Strategy 2 — RAG as a Required First Step

The `search_knowledge` tool is registered by `extensions/rag.ts`. Every skill instructs
the model to call it before generating code. This substitutes the model's unreliable
training memory with authoritative grounded-code-mcp content.

```markdown
## Before writing any code
1. Call search_knowledge("C# {pattern}", collection="dotnet")
2. Call search_code_examples("{pattern}", language="csharp")
3. Use the returned patterns — never invent APIs or method signatures
```

### Strategy 3 — Task Decomposition for Complex Work

Local models degrade on multi-step tasks. The `/decompose` prompt template enforces
atomic execution:

```markdown
## For any task touching 2+ files:
1. List the steps required (numbered, one sentence each)
2. Wait for user confirmation
3. Execute one step at a time — one file per response
4. After each step: state what was done and what is next
```

### Strategy 4 — Structured Output Templates

Force predictable output shape to reduce model "creativity" about formatting:

```
## Generate {filename}

Context from docs: {rag_chunks}
Existing code: {relevant_excerpts}
Task: {user_request}

Output exactly:
```{language}:{filename}
{code}
```
```

### Strategy 5 — Context Window Budget

| Layer | Budget (32K model) | Budget (8K model) |
|---|---|---|
| System prompt | 400 tokens | 300 tokens |
| RAG chunks (3 chunks) | 1,500 tokens | 500 tokens (1 chunk) |
| Active code files | 4,000 tokens | 2,000 tokens |
| Task prompt | 300 tokens | 200 tokens |
| Reserved for output | 2,000 tokens | 1,500 tokens |
| **Total used** | **~8,200 / 32K** | **~4,500 / 8K** |

`extensions/budget.ts` monitors token usage and triggers Pi's auto-compact at 80% capacity.

### Strategy 6 — Modelfile Tuning

```
PARAMETER temperature 0.15       # deterministic for code
PARAMETER top_p 0.9
PARAMETER top_k 40
PARAMETER repeat_penalty 1.1     # prevent repetition loops
PARAMETER num_ctx 32768          # tune per model
PARAMETER num_predict 2048       # cap output to prevent runaway generation
```

Temperature 0.15 (not 0.0) gives slight variation while keeping code deterministic.

---

## 6. Pi Agent Integration

### How Pi loads this package

```bash
# Install from this repo
pi install git:github.com/yourusername/pi-packages

# Or after npm publish
pi install npm:@yourusername/pi-packages
```

Pi reads the `pi` manifest in `package.json` and loads all extensions, skills, and prompts
into `~/.pi/agent/` automatically.

### Pi's project-level context loading

Pi reads `AGENTS.md` from `~/.pi/agent/`, every parent directory of the current project,
and the current directory. This mirrors CLAUDE.md loading. Each project can override
global harness rules with a local `.pi/AGENTS.md`.

### Invoking skills

```
/skill:dotnet       # load the .NET harness
/skill:python       # load the Python harness
/fix                # run the fix prompt template
/review             # run the review prompt template
/decompose          # break a complex task into steps
```

### Model switching

```
Ctrl+L              # cycle through configured models
/model              # open model picker
```

---

## 7. Repository Architecture

### `pi-packages` repo

```
pi-packages/
  package.json                  # Pi manifest + npm metadata
  AGENTS.md                     # Global harness rules (loaded by Pi on every session)
  ARCHITECTURE.md               # This document
  README.md

  packages/
    pi-dotnet/
      package.json              # Per-package Pi manifest
      skills/dotnet.md
      prompts/fix.md
      prompts/review.md
      prompts/generate.md
      prompts/explain.md
      prompts/decompose.md
      extensions/rag.ts
      extensions/router.ts
      extensions/budget.ts
      extensions/project-detect.ts
      modelfiles/dotnet.Modelfile

    pi-php/
      package.json
      skills/php.md
      prompts/                  # same 5 templates, php-specific context
      extensions/               # shared extensions symlinked or duplicated
      modelfiles/php.Modelfile

    pi-python/
      package.json
      skills/python.md
      prompts/
      extensions/
      modelfiles/python.Modelfile

    pi-robotics/
      package.json
      skills/robotics.md
      prompts/
      extensions/
      modelfiles/robotics.Modelfile

    pi-industrial/
      package.json
      skills/industrial.md
      prompts/
      extensions/
      modelfiles/industrial.Modelfile

  shared/
    extensions/
      rag.ts                    # grounded-code-mcp RAG tool (shared)
      router.ts                 # PC vs Mac Mini model routing (shared)
      budget.ts                 # context window guard (shared)
      project-detect.ts         # auto-load project-type skill (shared)
    prompts/
      fix.md                    # base templates (project packages override)
      review.md
      generate.md
      explain.md
      decompose.md
    models/
      models-us-eu.json         # List A model definitions
      models-best.json          # List B model definitions
      models-remote.json        # Tailscale/VPN endpoint overrides
```

### `ai-tools` repo

```
ai-tools/
  ollama/
    setup-pc.sh                 # Pull + configure models for RTX 3080
    setup-laptop.sh             # Pull + configure models for RTX 3060 (7B only)
    setup-mac.sh                # Pull + configure models for Mac Mini
    benchmark.sh                # Time inference per model per machine

  benchmarks/
    eval_runner.py              # Score harness quality per project type
    evals/
      dotnet.jsonl              # 20-question eval set
      php.jsonl
      python.jsonl
      robotics.jsonl
      industrial.jsonl

  network/
    tailscale-setup.md          # VPN setup for remote Mac Mini access
    ollama-network.md           # OLLAMA_HOST config, firewall rules

  grounded-mcp/
    collection-map.json         # project-type → grounded-code collection routing
    test-retrieval.py           # score retrieval quality per collection

  docs/
    architecture.md             # Portfolio: system design overview
    model-comparison.md         # Benchmark results by model and machine
    harness-design.md           # Design decisions and tradeoffs
```

---

## 8. Key Configurations

### `models.json`

Place at `~/.pi/agent/models.json` on each machine. Use the appropriate file from
`shared/models/` in this repo.

```json
{
  "models": [
    {
      "id": "laptop/granite-code:8b",
      "provider": "ollama",
      "baseUrl": "http://localhost:11434",
      "model": "granite-code:8b"
    },
    {
      "id": "pc/phi4:14b",
      "provider": "ollama",
      "baseUrl": "http://localhost:11434",
      "model": "phi4:14b"
    },
    {
      "id": "mac-mini/codestral:22b",
      "provider": "ollama",
      "baseUrl": "http://mac-mini:11434",
      "model": "codestral:22b"
    },
    {
      "id": "mac-mini/llama3.3:70b",
      "provider": "ollama",
      "baseUrl": "http://mac-mini:11434",
      "model": "llama3.3:70b"
    }
  ]
}
```

`models-best.json` substitutes `qwen2.5-coder:*` variants.
`models-remote.json` uses Tailscale MagicDNS hostname `mac-mini` (works identically on LAN and VPN).

---

### `AGENTS.md` (global)

Placed at `~/.pi/agent/AGENTS.md` via package install. Loaded on every Pi session.

```markdown
# Global Harness Rules

## Code quality
- Write only what was asked. No preamble, no trailing summaries.
- Mark all generated code: <AI-Generated START> ... <AI-Generated END>
- If uncertain: [CANNOT COMPLETE: <reason>] — never hallucinate APIs or method signatures
- Tests before production code, always

## Context
- Call search_knowledge before generating any unfamiliar pattern
- Call search_code_examples for implementation examples
- Read existing code before writing — match conventions exactly

## Task approach
- Single function: generate directly
- 2+ files: decompose first, confirm, execute one file at a time
- Open-ended design: reason through options, present a recommendation with tradeoffs

## Security
- Parameterized queries only — no string-concatenated SQL
- Never log passwords, tokens, or PII
- Validate all inputs at system boundaries

## Output
- One file per fenced code block, filename as block label
- No TODO comments — either implement it or mark [CANNOT COMPLETE]
```

---

### Extension: `rag.ts`

```typescript
// <AI-Generated START>
export default function(pi: ExtensionAPI) {
  pi.registerTool({
    name: "search_knowledge",
    description: "Search grounded engineering documentation for patterns and standards",
    parameters: {
      query: { type: "string", description: "2-6 content words, no filler" },
      collection: { type: "string", description: "dotnet | python | php | javascript | databases | robotics | automation | edge_ai | systems_thinking | internal" }
    },
    execute: async ({ query, collection }) => {
      const result = await pi.callMcp("grounded-code-mcp", "search_knowledge", {
        query,
        collection,
        n_results: 3,
        min_score: 0.5
      });
      return formatChunks(result);
    }
  });

  pi.registerTool({
    name: "search_code_examples",
    description: "Search for authoritative code examples in the knowledge base",
    parameters: {
      query: { type: "string" },
      language: { type: "string", description: "csharp | python | php | typescript | javascript" }
    },
    execute: async ({ query, language }) => {
      const result = await pi.callMcp("grounded-code-mcp", "search_code_examples", {
        query,
        language,
        n_results: 2
      });
      return formatChunks(result);
    }
  });
}

function formatChunks(result: any): string {
  return result.map((r: any) =>
    `[Source: ${r.source_path}]\n${r.content}`
  ).join("\n\n---\n\n");
}
// <AI-Generated END>
```

---

### Extension: `router.ts`

```typescript
// <AI-Generated START>
const COMPLEXITY_THRESHOLDS = {
  simple: 150,   // tokens — route to local fast model
  medium: 500,   // route to PC primary
  deep: Infinity // route to Mac Mini
};

export default function(pi: ExtensionAPI) {
  pi.on("session_start", async (event, ctx) => {
    const len = ctx.message?.length ?? 0;

    if (len < COMPLEXITY_THRESHOLDS.simple) {
      // stay on current machine's fast model — no switch needed
      return;
    }

    if (len < COMPLEXITY_THRESHOLDS.medium) {
      await ctx.setModel("pc/phi4:14b");
    } else {
      await ctx.setModel("mac-mini/codestral:22b");
    }
  });
}
// <AI-Generated END>
```

---

### Skill: `dotnet.md` (full draft)

Place at `packages/pi-dotnet/skills/dotnet.md`.

```markdown
# dotnet
Use this skill when working on .NET, C#, ASP.NET Core, SQL Server, Entity Framework Core, or React/TypeScript projects.

## Before writing any code
1. Call search_knowledge("C# {pattern}", collection="dotnet")
2. Call search_knowledge("SQL {pattern}", collection="databases") for any SQL or EF Core work
3. Call search_knowledge("{component}", collection="javascript") for React/TypeScript
4. Call search_code_examples("{pattern}", language="csharp") for implementation examples
5. Use returned patterns — never invent method signatures or library APIs

## Invariants
- Target .NET 10 unless project context specifies otherwise
- Enable nullable reference types; treat warnings as errors
- Prefer async/await end-to-end — never .Result or .Wait() on async methods
- Propagate CancellationToken through all async call chains
- Use using / await using for all IDisposable/IAsyncDisposable resources
- Vertical slice architecture: feature folders, not layer folders
- CQRS: commands mutate state, queries return data — never mix
- Parameterized queries only — no string-concatenated SQL under any circumstances
- Mark all generated blocks: // <AI-Generated START> ... // <AI-Generated END>

## Task approach
- Single function or property: generate directly
- Feature touching 2+ files: list steps, confirm, execute one file at a time
- Any uncertainty about a .NET API: [CANNOT COMPLETE: <reason>] — never guess

## Quality gates
- Cyclomatic complexity per method < 10
- Test file created before production file
- All public API members have XML doc comments
- Code coverage target ≥ 80% for business logic

## grounded-code collections for this project type
- dotnet — EF Core, DI in .NET, ASP.NET Core, Telerik
- databases — SQL Server patterns, indexing, relational theory
- javascript — React, TypeScript, Vue
- patterns — CQRS, Clean Architecture, DDD, vertical slice
- internal — XP practices, TDD, OWASP
```

---

## 9. Implementation Phases

### Phase 1 — Network & Inference Foundation (Week 1)

- [ ] Install [Tailscale](https://tailscale.com) on Mac Mini, PC, and Laptop
  - Gives consistent `mac-mini` MagicDNS hostname on LAN and VPN
- [ ] On Mac Mini: `launchctl setenv OLLAMA_HOST "0.0.0.0"` (or set in Ollama service config)
- [ ] Verify from PC: `curl http://mac-mini:11434/api/tags`
- [ ] Pull models per machine using `ai-tools/ollama/setup-*.sh`
- [ ] Install Pi on all three machines: `curl -fsSL https://pi.dev/install.sh | sh`
- [ ] Add `models.json` to `~/.pi/agent/` on each machine; verify Ollama provider connects
- [ ] Run one test prompt per machine confirming Mac Mini is reachable

### Phase 2 — `pi-packages` Core (Weeks 2–3)

- [ ] Write `AGENTS.md` (global rules — see template above)
- [ ] Write `package.json` Pi manifest for each of the 5 packages
- [ ] Write `shared/extensions/rag.ts` — connect to grounded-code-mcp
- [ ] Write `shared/extensions/project-detect.ts` — load skill from `.pi/skills/`
- [ ] Write `shared/extensions/budget.ts` — warn at 80% context, trigger compaction
- [ ] Write all 5 skills starting with `dotnet.md` (highest immediate value — PSMD project)
- [ ] Write 5 base prompt templates in `shared/prompts/`
- [ ] Test: `pi install git:github.com/yourusername/pi-packages` → skills and extensions load

### Phase 3 — Routing + Modelfiles (Week 3)

- [ ] Write `shared/extensions/router.ts` — PC vs Mac Mini switching by task size
- [ ] Write 5 Modelfiles (one per project type): temperature, num_ctx, system prompt stub
- [ ] Register Modelfiles with Ollama: `ollama create dotnet-coder -f packages/pi-dotnet/modelfiles/dotnet.Modelfile`
- [ ] Test full loop: Pi session → skill auto-loaded → RAG called → routed to correct machine
- [ ] Test `Ctrl+L` model cycling between all configured endpoints

### Phase 4 — RAG Tuning & Benchmarks (Week 4)

- [ ] Build `ai-tools/benchmarks/eval_runner.py` — 20 questions per project type
- [ ] Score each model/machine combination; record in `docs/model-comparison.md`
- [ ] Tune `n_results` per collection based on retrieval quality scores (start at 3)
- [ ] Adjust Modelfile `temperature` and `repeat_penalty` based on output quality
- [ ] Validate hybrid retrieval (vector + BM25) for code-search queries if needed

### Phase 5 — Remote Access & Portfolio Polish (Week 5)

- [ ] Test VPN path: Laptop → Tailscale → Mac Mini Ollama — validate latency
- [ ] Add `models-remote.json` with Tailscale hostnames as LAN fallback
- [ ] `npm publish --access public` for each package
- [ ] Write `ai-tools/docs/architecture.md` and benchmark table for portfolio
- [ ] Add GitHub Actions CI: TypeScript lint on extensions, eval smoke test on PR

---

## 10. Network Setup

### Mac Mini — Ollama Network Exposure

```bash
# Add to Mac Mini's shell profile or Ollama service config
export OLLAMA_HOST=0.0.0.0
export OLLAMA_ORIGINS="*"   # allow cross-origin requests from PC/Laptop

# Restart Ollama after change
ollama stop && ollama serve
```

### Tailscale (recommended over raw VPN)

Tailscale gives each machine a stable MagicDNS hostname (`mac-mini`, `my-pc`, `laptop`)
that works identically on LAN, off-site, and over VPN. The `models.json` never needs
IP addresses — always use the MagicDNS name.

```bash
# Install on each machine
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up

# Verify from PC
curl http://mac-mini:11434/api/tags
```

### `models-remote.json` (Tailscale fallback)

```json
{
  "models": [
    {
      "id": "mac-mini/codestral:22b",
      "provider": "ollama",
      "baseUrl": "http://mac-mini.tail12345.ts.net:11434",
      "model": "codestral:22b"
    }
  ]
}
```

Use `models-remote.json` only if MagicDNS short names don't resolve outside the tailnet.
In most Tailscale setups, `http://mac-mini:11434` works everywhere without modification.

---

## Reference: grounded-code-mcp Collection Map

| Project Type | Primary Collections | Secondary Collections |
|---|---|---|
| .NET / SQL / React | `dotnet`, `databases` | `javascript`, `patterns`, `internal` |
| PHP / Laravel / VueJS | `php`, `javascript` | `patterns`, `internal` |
| Python | `python` | `patterns`, `internal`, `databases` |
| Robotics | `robotics`, `edge_ai` | `automation`, `systems_thinking` |
| Industrial Automation | `automation` | `systems_thinking`, `gov` |

Pass only the collection suffix to `search_knowledge` (the MCP server prepends `grounded_` automatically).

---

*Document generated: 2026-06-04. Reflects Pi v1.x (Earendil Inc.), Ollama, and grounded-code-mcp architecture as of this date.*
