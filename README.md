# pi-packages

Project-type harnesses for [Pi](https://pi.dev) (Earendil Inc.) — a local coding agent backed by [Ollama](https://ollama.com) inference.

Each harness package ships a **skill** (behavior rules), **prompt templates** (fix/review/generate/explain/decompose), **TypeScript extensions** (RAG, routing, context budget), and an **Ollama Modelfile** tuned for the project type.

**Available packages**

| Package | Project types |
|---|---|
| `pi-dotnet` | .NET / C# / ASP.NET Core / EF Core / SQL Server / React |
| `pi-php` | PHP / Laravel / Vue.js |
| `pi-python` | Python / FastAPI / SQLAlchemy / pytest |
| `pi-robotics` | ROS 2 / Python / C++ / edge AI / MuJoCo / Isaac Lab / LeRobot |
| `pi-industrial` | MODBUS / OPC UA / PLC (IEC 61131-3) / SCADA / ICS security |

---

## Prerequisites

| Tool | Min version | Install |
|---|---|---|
| [Node.js](https://nodejs.org) | 20 LTS | `nvm install 20` |
| [Pi agent](https://pi.dev) | 1.x | See below |
| [Ollama](https://ollama.com) | latest | See below |
| Git | any | system package manager |

### Install Pi

```bash
curl -fsSL https://pi.dev/install.sh | sh
```

Verify: `pi --version`

### Install Ollama

```bash
# Linux
curl -fsSL https://ollama.com/install.sh | sh

# macOS
brew install ollama
```

Verify: `ollama --version`

---

## Hardware & model selection

Choose the model list that matches your environment:

| File | Use when |
|---|---|
| `shared/models/models-us-eu.json` | Restricted clients — US/EU origin models only |
| `shared/models/models-best.json` | Best quality regardless of model origin |
| `shared/models/models-remote.json` | Tailscale VPN override (if MagicDNS short names don't resolve) |

| Machine | VRAM | Recommended primary model |
|---|---|---|
| Laptop (RTX 3060) | 6 GB | `granite-code:8b` / `qwen2.5-coder:7b` |
| PC (RTX 3080) | 10 GB | `phi4:14b` / `qwen2.5-coder:14b` |
| Mac Mini (Apple Silicon) | 48 GB unified | `granite-code:34b` / `qwen2.5-coder:32b` |

---

## Setup

### 1. Clone and install dependencies

```bash
git clone https://codeberg.org/malber/pi-packages.git
cd pi-packages
npm install
```

### 2. Pull Ollama models

Pull the models for your machine. Swap `granite-code:34b` for `qwen2.5-coder:32b` if you are on List B (best overall).

```bash
# Mac Mini (primary + deep reasoning)
ollama pull granite-code:34b
ollama pull llama3.3:70b
ollama pull nomic-embed-text       # embeddings

# PC (RTX 3080)
ollama pull phi4:14b
ollama pull granite-code:8b

# Laptop (RTX 3060)
ollama pull granite-code:8b
ollama pull phi3.5:3.8b
```

### 3. Expose Ollama on the Mac Mini (network inference)

So the PC and Laptop can route heavy tasks to the Mac Mini:

```bash
# Mac Mini — add to shell profile or Ollama service config
export OLLAMA_HOST=0.0.0.0
export OLLAMA_ORIGINS="*"

# Restart
ollama stop && ollama serve
```

Verify from your PC:
```bash
curl http://mac-mini:11434/api/tags
```

If you use Tailscale, `mac-mini` resolves via MagicDNS on both LAN and VPN automatically.

### 4. Register Modelfiles with Ollama

Run the commands for the packages you use. Each creates a named custom model in Ollama:

```bash
# From the repo root
ollama create dotnet-coder      -f packages/pi-dotnet/modelfiles/dotnet.Modelfile
ollama create php-coder         -f packages/pi-php/modelfiles/php.Modelfile
ollama create python-coder      -f packages/pi-python/modelfiles/python.Modelfile
ollama create robotics-coder    -f packages/pi-robotics/modelfiles/robotics.Modelfile
ollama create industrial-coder  -f packages/pi-industrial/modelfiles/industrial.Modelfile
```

Each Modelfile defaults to the Mac Mini base model. Swap the `FROM` line before running if you are on the PC (`phi4:14b`) or Laptop (`phi3.5:3.8b`).

Verify: `ollama list` — the new model names should appear.

### 5. Configure Pi models

Copy the right model file to your Pi agent config directory:

```bash
# List A (US/EU)
cp shared/models/models-us-eu.json ~/.pi/agent/models.json

# List B (best overall)
cp shared/models/models-best.json ~/.pi/agent/models.json
```

Open `~/.pi/agent/models.json` and update `baseUrl` values to match your actual hostnames if needed.

### 6. Connect grounded-code-mcp (optional but strongly recommended)

The RAG extension calls `grounded-code-mcp` to inject authoritative documentation into every model call. Without it, the `search_knowledge` tool is registered but returns empty results — the model falls back to training data.

See [grounded-code-mcp](https://codeberg.org/malber/grounded-code-mcp) for setup.

### 7. Install the harness into Pi

**From git (development / no npm account needed):**

```bash
pi install git:codeberg.org/malber/pi-packages/packages/pi-dotnet
pi install git:codeberg.org/malber/pi-packages/packages/pi-php
pi install git:codeberg.org/malber/pi-packages/packages/pi-python
pi install git:codeberg.org/malber/pi-packages/packages/pi-robotics
pi install git:codeberg.org/malber/pi-packages/packages/pi-industrial
```

**From npm (after publishing):**

```bash
pi install npm:@malber/pi-dotnet
pi install npm:@malber/pi-php
pi install npm:@malber/pi-python
pi install npm:@malber/pi-robotics
pi install npm:@malber/pi-industrial
```

Install only the packages relevant to your projects — you do not need all five.

Verify: `pi skills` — the installed skill names should appear in the list.

---

## Usage

### Load a skill

```
/skill:dotnet       .NET / C# / ASP.NET Core / EF Core
/skill:php          PHP / Laravel / Vue.js
/skill:python       Python / FastAPI / SQLAlchemy / pytest
/skill:robotics     ROS 2 / edge AI / MuJoCo / Isaac Lab
/skill:industrial   MODBUS / OPC UA / PLC / SCADA
```

`project-detect` loads the right skill automatically based on project signals (`.csproj`, `composer.json`, `pyproject.toml`, `package.xml`, `Makefile` with MODBUS/OPC patterns). Use the explicit `/skill:` command to override.

### Run a prompt template

```
/fix          Fix the bug described below
/review       Review the code for correctness, security, and conventions
/generate     Generate new code from a description
/explain      Explain what this code does and why
/decompose    Break a multi-file task into atomic steps before starting
```

### Switch models

```
Ctrl+L        Cycle through configured models
/model        Open model picker
```

The router extension switches automatically based on message length:
- < 150 tokens → stays on the current fast local model
- 150–500 tokens → routes to `pc/phi4:14b`
- 500+ tokens → routes to `mac-mini/codestral:22b` (or List B equivalent)

---

## Repository structure

```
pi-packages/
  AGENTS.md                   Global harness rules (loaded by Pi on every session)
  package.json                npm workspace root
  tsconfig.json               TypeScript config for all extensions
  scripts/
    prepublish.js             Resolves symlinks before npm publish

  shared/
    types/
      pi.d.ts                 Pi ExtensionAPI TypeScript declarations
    extensions/               Source of truth for all extensions
      rag.ts                    grounded-code-mcp RAG tools
      router.ts                 PC / Mac Mini routing by task size
      budget.ts                 Context window guard (auto-compact at 80%)
      project-detect.ts         Auto-loads skill from project files
    prompts/                  Base prompt templates (project packages extend these)
      fix.md  review.md  generate.md  explain.md  decompose.md
    models/
      models-us-eu.json       List A: US/EU origin models only
      models-best.json        List B: best overall
      models-remote.json      Tailscale VPN hostname overrides

  packages/
    pi-dotnet/
    pi-php/
    pi-python/
    pi-robotics/
    pi-industrial/
      Each package contains:
      package.json            Pi manifest + npm metadata
      skills/<type>.md        Skill: invariants and grounded-code collection map
      prompts/                5 prompt templates (fix/review/generate/explain/decompose)
      extensions/             Symlinks → shared/extensions/
      modelfiles/
        <type>.Modelfile      Ollama Modelfile (temperature, context, system prompt)
```

---

## Development

### Type-check all extensions

```bash
npm run lint
```

### Add a new project-type package

1. `mkdir -p packages/pi-<type>/{skills,prompts,extensions,modelfiles}`
2. Copy `packages/pi-dotnet/package.json` and update name/description
3. Write `skills/<type>.md` with invariants and grounded-code collection map
4. Write the 5 prompt templates in `prompts/`
5. Create symlinks to `shared/extensions/`:
   ```bash
   cd packages/pi-<type>/extensions
   for f in rag router budget project-detect; do
     ln -s ../../../shared/extensions/${f}.ts ${f}.ts
   done
   ```
6. Write `modelfiles/<type>.Modelfile` — set `FROM` to the right base model
7. Add project signals to `shared/extensions/project-detect.ts`

### Publish to npm

```bash
# Resolves symlinks, publishes, then restores them
node scripts/prepublish.js pi-dotnet
```

---

## Tailscale (remote Mac Mini access)

Tailscale gives every machine a stable MagicDNS hostname (`mac-mini`, `my-pc`, `laptop`) that works on LAN and VPN without IP address changes.

```bash
# Install on each machine
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up

# Verify from PC or Laptop
curl http://mac-mini:11434/api/tags
```

If short names don't resolve outside your tailnet, copy `shared/models/models-remote.json` to `~/.pi/agent/models.json` and replace `tail12345` with your actual tailnet name from `tailscale status`.

---

## License

MIT
