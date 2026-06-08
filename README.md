# pi-packages

Domain-specific coding harnesses for [Pi](https://pi.dev) (Earendil Inc.) backed entirely by local inference — no cloud API keys, no code leaving your machine.

Each package teaches Pi how to behave as a domain expert for a specific stack. When you open a project, Pi loads the matching harness automatically: it pulls authoritative documentation into context via RAG before generating a single line of code, routes the task to the most capable model available on your hardware, and enforces stack-specific invariants throughout.

Local models don't self-correct the way frontier models do. Getting reliable output from a 14B parameter model requires skill files precise enough to fit in 500 tokens, RAG grounding before generation rather than as a fallback, and routing logic that matches model capability to task complexity. These packages encode that discipline across six project types so you don't have to rediscover it per stack.

Supports [Ollama](https://ollama.com) on all platforms and [MLX-LM](https://github.com/ml-explore/mlx-lm) on Apple Silicon.

---

## Why I built this

I wanted AI coding support that worked offline, kept my code local, and didn't require an API subscription. Ollama makes the inference side straightforward — getting reliable output from it turned out to be a different problem.

Local models are smaller and don't self-correct the way cloud models do. The same approach that works well with Claude — open-ended prompts, loosely structured requests — produces mediocre results with a 14B model on consumer hardware. What I found works is the opposite: short, precise instruction files, RAG grounding before the model generates anything, and routing logic that sends more complex tasks to the most capable model available on the machine.

pi-packages is the result of working through that problem for each stack I use regularly. Six project types, one consistent structure, all sharing the same four extensions.

---

## Packages

| Package | Project types |
|---|---|
| `pi-dotnet` | .NET / C# / ASP.NET Core / EF Core / SQL Server / React |
| `pi-php` | PHP / Laravel / Vue.js |
| `pi-python` | Python / FastAPI / SQLAlchemy / pytest |
| `pi-robotics` | ROS 2 / Python / C++ / edge AI / MuJoCo / Isaac Lab / LeRobot |
| `pi-industrial` | MODBUS / OPC UA / PLC (IEC 61131-3) / SCADA / ICS security |
| `pi-rust` | Rust — systems, embedded (embassy, rp-hal), CLI, Axum, robotics (rclrs) |

Install only the packages relevant to your projects.

---

## How it works

Each package is composed of four parts that work together:

**Skill** (`skills/<type>.md`) — a precision instruction file under 500 tokens that defines the invariants, output format, and grounded-code collection map for the domain. The token budget is a hard constraint: local models degrade on long system prompts, so every word earns its place.

**Prompt templates** (`prompts/`) — eight structured templates (fix / review / generate / explain / decompose / red / green / refactor) that constrain the model's response shape. The three TDD phase templates lock each stage of Red→Green→Refactor so the model cannot conflate phases — invoke them explicitly as `/red`, `/green`, `/refactor`. Structured output matters more with local models than with cloud models because local inference has less error correction.

**TypeScript extensions** (`extensions/`) — four shared extensions wired into every package via symlinks:
- `rag.ts` — calls `grounded-code-mcp` CLI via subprocess (`--json` output) to inject vetted documentation before each response; registers `search_knowledge` and `search_code_examples` tools that the model invokes before generating code
- `router.ts` — routes by message length: fast local model under 150 tokens, mid-tier PC model to 500, heavy Mac Mini model above
- `budget.ts` — monitors context window usage and triggers Pi auto-compact at 80% capacity
- `project-detect.ts` — reads project signals (`.csproj`, `Cargo.toml`, `composer.json`, etc.) and loads the right skill without manual configuration

**Modelfile** (`modelfiles/<type>.Modelfile`) — Ollama convenience wrapper that sets temperature, context window, and a system prompt stub. The Modelfile is Ollama-only; behavior rules are authoritative in the skill file, which MLX-LM users get directly.

The shared extensions live in `shared/extensions/` and are symlinked into each package. `scripts/prepublish.js` resolves the symlinks before publishing to npm and restores them after, keeping the source tree clean without breaking consumers.

---

## Prerequisites

| Tool | Min version | Install |
|---|---|---|
| [Node.js](https://nodejs.org) | 20 LTS | `nvm install 20` |
| [Pi agent](https://pi.dev) | 1.x | `curl -fsSL https://pi.dev/install.sh \| sh` |
| [Ollama](https://ollama.com) | latest | `curl -fsSL https://ollama.com/install.sh \| sh` |
| [MLX-LM](https://github.com/ml-explore/mlx-lm) | latest | `pip install mlx-lm` — Apple Silicon only |
| Git | any | system package manager |

Verify installs: `pi --version` / `ollama --version`

---

## Setup

### 1. Clone and install

```bash
git clone https://codeberg.org/michaelkalber/pi-packages.git
cd pi-packages
npm install
```

### 2. Pull Ollama models

Pull the models for your list and hardware tier. Choose List B for best quality or List A if your project requires US/EU origin models only.

```bash
# List B — best overall (models-best.json)
ollama pull qwen3-coder:30b       # PC primary — MoE, fits 10 GB VRAM, 256K context
ollama pull devstral:24b          # PC agentic — multi-file edits, 256K context
ollama pull qwen2.5-coder:14b     # PC lighter option
ollama pull qwen2.5-coder:7b      # Laptop / fast fallback
ollama pull snowflake-arctic-embed2  # embeddings — required for grounded-code-mcp RAG

# List A — US/EU origin only (models-us-eu.json)
ollama pull phi4:14b              # PC primary
ollama pull granite-code:8b       # Laptop / fallback
ollama pull phi3.5:3.8b           # ultrafast fallback
ollama pull snowflake-arctic-embed2  # embeddings — required for grounded-code-mcp RAG
```

Mac Mini (MLX-LM): models download automatically on first `mlx_lm.server` run — no `ollama pull` needed.

### 3. Hardware & model selection

Choose the model list that matches your environment:

| File | Use when |
|---|---|
| `shared/models/models-us-eu.json` | US/EU origin models only (compliance requirement) |
| `shared/models/models-best.json` | Best quality regardless of origin |
| `shared/models/models-remote.json` | Tailscale VPN — Ollama Mac Mini |
| `shared/models/models-mac-mini-mlx.json` | Mac Mini on Apple Silicon — MLX-LM backend |
| `shared/models/models-remote-mlx.json` | Tailscale VPN — MLX-LM Mac Mini |

| Machine | List | Backend | Recommended primary model |
|---|---|---|---|
| Laptop (RTX 3060) | List A | Ollama | `granite-code:8b` / `phi3.5:3.8b` |
| Laptop (RTX 3060) | List B | Ollama | `qwen2.5-coder:7b` |
| PC (RTX 3080) | List A | Ollama | `phi4:14b` |
| PC (RTX 3080) | List B | Ollama | `qwen3-coder:30b` / `devstral:24b` |
| Mac Mini (Apple Silicon) | — | MLX-LM | `Qwen2.5-Coder-32B-Instruct-4bit` (~18 GB) |

### 4a. Mac Mini: expose Ollama for network inference

```bash
export OLLAMA_HOST=0.0.0.0
export OLLAMA_ORIGINS="*"
ollama stop && ollama serve
```

Verify from PC: `curl http://mac-mini:11434/api/tags`

If you use Tailscale, `mac-mini` resolves via MagicDNS on both LAN and VPN automatically.

### 4b. Mac Mini: MLX-LM (alternative to Ollama on Apple Silicon)

MLX-LM uses Metal natively and gives better throughput than Ollama on M-series chips.

```bash
pip install mlx-lm

mlx_lm.server \
  --model mlx-community/Qwen2.5-Coder-32B-Instruct-4bit \
  --port 8080 \
  --host 0.0.0.0
```

`mlx_lm.server` serves one model at a time; restart with a different `--model` to switch.

| Use case | Model | Approx size |
|---|---|---|
| Primary coding | `mlx-community/Qwen2.5-Coder-32B-Instruct-4bit` | ~18 GB |
| Deep reasoning | `mlx-community/Llama-3.3-70B-Instruct-4bit` | ~38 GB |
| EU coding / PHP | `mlx-community/Codestral-22B-v0.1-4bit` | ~12 GB |
| RAG tasks | `mlx-community/c4ai-command-r-v01-4bit` | ~19 GB |

Keep Ollama running on the Mac Mini for embeddings only:

```bash
ollama pull snowflake-arctic-embed2   # grounded-code-mcp RAG embeddings
```

Verify MLX-LM from PC: `curl http://mac-mini:8080/v1/models`

### 5. Register Modelfiles

```bash
ollama create dotnet-coder      -f packages/pi-dotnet/modelfiles/dotnet.Modelfile
ollama create php-coder         -f packages/pi-php/modelfiles/php.Modelfile
ollama create python-coder      -f packages/pi-python/modelfiles/python.Modelfile
ollama create robotics-coder    -f packages/pi-robotics/modelfiles/robotics.Modelfile
ollama create industrial-coder  -f packages/pi-industrial/modelfiles/industrial.Modelfile
ollama create rust-coder        -f packages/pi-rust/modelfiles/rust.Modelfile
```

All Modelfiles default to `FROM qwen3-coder:30b` (PC primary — MoE, fits 10 GB VRAM). Edit the `FROM` line for other targets; the comments at the top of each Modelfile list the alternatives for each hardware tier and list.

Verify: `ollama list`

### 6. Configure Pi models

**Single machine (Ollama):**
```bash
cp shared/models/models-best.json ~/.pi/agent/models.json
# or models-us-eu.json for compliance-restricted environments
```

**Mac Mini only (MLX-LM):**
```bash
cp shared/models/models-mac-mini-mlx.json ~/.pi/agent/models.json
```

**Mixed fleet:** Start from `models-best.json`, then merge the appropriate remote provider block into the `providers` object — `ollama-mac-mini` from `models-remote.json` or `mlx-lm-mac-mini` from `models-mac-mini-mlx.json`. Update `router-config.json` to reference the `mac-mini/*` model IDs for the `complex` tier.

### 7. Install grounded-code-mcp

[grounded-code-mcp](https://codeberg.org/michaelkalber/grounded-code-mcp) is a local RAG server that gives Pi retrieval access to a curated knowledge base — books, standards documents, and official docs stored as local vector embeddings. The `rag.ts` extension calls its CLI directly via subprocess; no MCP server process or separate Pi extension is needed.

**Install:**

```bash
pipx install git+https://codeberg.org/michaelkalber/grounded-code-mcp.git
```

**Start prerequisites (required once):**

```bash
ollama pull snowflake-arctic-embed2          # embedding model (1024-dim, 8K context)
docker run -d -p 6333:6333 qdrant/qdrant     # vector store
```

Ingest your sources, then verify the CLI works:

```bash
grounded-code-mcp ingest
grounded-code-mcp search "async cancellation token" --collection dotnet --json
```

Without grounded-code-mcp installed and ingested, `search_knowledge` and `search_code_examples` return an unavailability message and the model falls back to training data alone. See [grounded-code-mcp](https://codeberg.org/michaelkalber/grounded-code-mcp) for the full ingestion and collection setup guide.

### 8. Install packages into Pi

**From git (no npm account required):**
```bash
pi install git:codeberg.org/michaelkalber/pi-packages/packages/pi-dotnet
pi install git:codeberg.org/michaelkalber/pi-packages/packages/pi-php
pi install git:codeberg.org/michaelkalber/pi-packages/packages/pi-python
pi install git:codeberg.org/michaelkalber/pi-packages/packages/pi-robotics
pi install git:codeberg.org/michaelkalber/pi-packages/packages/pi-industrial
pi install git:codeberg.org/michaelkalber/pi-packages/packages/pi-rust
```

**From npm:**
```bash
pi install npm:@malber/pi-dotnet
pi install npm:@malber/pi-php
pi install npm:@malber/pi-python
pi install npm:@malber/pi-robotics
pi install npm:@malber/pi-industrial
pi install npm:@malber/pi-rust
```

Verify: `pi skills` — installed skill names should appear in the list.

---

## Usage

### Load a skill

```
/skill:dotnet       .NET / C# / ASP.NET Core / EF Core
/skill:php          PHP / Laravel / Vue.js
/skill:python       Python / FastAPI / SQLAlchemy / pytest
/skill:robotics     ROS 2 / edge AI / MuJoCo / Isaac Lab
/skill:industrial   MODBUS / OPC UA / PLC / SCADA
/skill:rust         Rust — systems, embedded, CLI, Axum, robotics
```

`project-detect` loads the right skill automatically based on project signals. Use `/skill:` to override.

### Run a prompt template

```
/fix          Fix the bug described below
/review       Review the code for correctness, security, and conventions
/generate     Generate new code from a description
/explain      Explain what this code does and why
/decompose    Break a multi-file task into atomic steps before starting
/red          Write ONE failing test (Red phase — no production code)
/green        Write minimum code to make the failing test pass
/refactor     Improve structure without changing behavior (all tests must stay green)
```

### Switch models

```
Ctrl+L        Cycle through configured models
/model        Open model picker
```

The router switches automatically by message length:
- `< 150 tokens` — current fast local model
- `150–500 tokens` — mid-tier model (`pc/phi4:14b`)
- `500+ tokens` — heavy model (`mac-mini/codestral:22b` or List B equivalent)

---

## Repository structure

```
pi-packages/
  AGENTS.md                   Project context (loaded by Pi each session)
  intent.md                   Engineering values and tradeoff rules
  package.json                npm workspace root
  tsconfig.json               TypeScript config for all extensions
  scripts/
    prepublish.js             Resolves symlinks before npm publish, restores after

  shared/
    types/
      pi.d.ts                 Pi ExtensionAPI TypeScript declarations
    extensions/               Source of truth — packages symlink these in
      rag.ts                  grounded-code-mcp RAG integration
      router.ts               PC / Mac Mini routing by task complexity
      budget.ts               Context window guard (auto-compact at 80%)
      project-detect.ts       Loads correct skill from project file signals
    prompts/                  Base prompt templates
      fix.md  review.md  generate.md  explain.md  decompose.md
      red.md  green.md  refactor.md
    models/
      models-us-eu.json           List A: US/EU origin models (Ollama)
      models-best.json            List B: best overall (Ollama)
      models-remote.json          Tailscale VPN overrides (Ollama)
      models-mac-mini-mlx.json    Mac Mini MLX-LM backend
      models-remote-mlx.json      Tailscale VPN overrides (MLX-LM)

  packages/
    pi-dotnet/ pi-php/ pi-python/ pi-robotics/ pi-industrial/ pi-rust/
      Each package:
      package.json            Pi manifest + npm metadata
      skills/<type>.md        Behavior invariants + grounded-code collection map
      prompts/                8 prompt templates (domain-specific overrides)
      extensions/             Symlinks → shared/extensions/
      modelfiles/
        <type>.Modelfile      Ollama model wrapper (temperature 0.15, num_ctx)
```

---

## Development

### Type-check all extensions

```bash
npm run lint
```

### Add a new project-type package

1. `mkdir -p packages/pi-<type>/{skills,prompts,extensions,modelfiles}`
2. Copy `packages/pi-dotnet/package.json` — update name and description
3. Write `skills/<type>.md` — invariants, output format, grounded-code collection map; stay under 500 tokens
4. Write the 5 prompt templates in `prompts/`
5. Symlink shared extensions:
   ```bash
   cd packages/pi-<type>/extensions
   for f in rag router budget project-detect; do
     ln -s ../../../shared/extensions/${f}.ts ${f}.ts
   done
   ```
6. Write `modelfiles/<type>.Modelfile` — set `FROM` to the right base model
7. Add project signals to `shared/extensions/project-detect.ts`
8. Run `npm run lint` — must pass before commit

### Publish to npm

```bash
# Always use prepublish.js — never npm publish directly
# Publishing broken symlinks to npm breaks installation for consumers
node scripts/prepublish.js pi-dotnet
node scripts/prepublish.js pi-php
node scripts/prepublish.js pi-python
node scripts/prepublish.js pi-robotics
node scripts/prepublish.js pi-industrial
node scripts/prepublish.js pi-rust
```

---

## Tailscale (remote Mac Mini access)

Tailscale gives every machine a stable MagicDNS hostname (`mac-mini`, `my-pc`, `laptop`) that works on both LAN and VPN without IP address changes.

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up

# Verify from PC or Laptop
curl http://mac-mini:11434/api/tags
```

If short hostnames don't resolve outside your tailnet, use the corresponding `models-remote*.json` file and replace `tail12345` with your actual tailnet name from `tailscale status`.

---

## Related

**[grounded-code-mcp](https://codeberg.org/michaelkalber/grounded-code-mcp)** — the local RAG server that powers the `rag.ts` extension. Ingests books, standards, and official docs into a vector store (Qdrant or ChromaDB) and a concept graph (NetworkX DiGraph). Exposes five tools to Pi via CLI subprocesses, five MCP tools for Claude Code and OpenCode, and a `query-graph` command for concept-relationship traversal. 17 curated collections; fully local embeddings via Ollama.

**[ai-toolkit](https://codeberg.org/michaelkalber/ai-toolkit)** — 103 skills, 49 agents, and 22 slash commands for Claude Code, OpenCode, and Pi. Covers TDD, .NET, Python, PHP, Rust, React, edge AI, and the QRSPI/QRASPI workflow systems for both existing and greenfield codebases.

pi-packages is the local inference layer: hardware routing, RAG integration, context budgeting, and project-type detection. grounded-code-mcp is the knowledge layer beneath it. ai-toolkit is the skill and agent layer above it. All three work independently; together they form a complete local AI development environment.

---

## Author

**Michael K. Alber** — [codeberg.org/michaelkalber](https://codeberg.org/michaelkalber)

Software engineer working across enterprise .NET, Python, Rust, edge AI, and federal security domains. I'm actively integrating AI-assisted development into my daily workflow — these projects reflect what I've learned about making local inference reliable, grounded in real sources, and actually useful for the kind of work I do.

---

## License

MIT
