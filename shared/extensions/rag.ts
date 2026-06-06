// <AI-Generated START>
// RAG extension: calls grounded-code-mcp CLI with --json output to inject
// vetted documentation before the model generates code.
// Requires: pipx install grounded-code-mcp (see grounded-code-mcp for setup)

import { spawnSync } from "child_process";

export default function(pi: ExtensionAPI) {
  pi.registerTool({
    name: "search_knowledge",
    description: "Search grounded engineering documentation for patterns and standards",
    parameters: {
      query: {
        type: "string",
        description: "2–6 content words, no filler (e.g. 'EF Core repository pattern', 'async cancellation token')"
      },
      collection: {
        type: "string",
        description: "dotnet | python | php | javascript | databases | robotics | automation | edge_ai | systems_thinking | internal | patterns | architecture",
        optional: true
      },
      n_results: {
        type: "number",
        description: "Number of results (default 3, max 6)",
        optional: true
      }
    },
    execute: async ({ query, collection, n_results }) => {
      const args = [
        "search", String(query),
        "--json",
        "-n", String(n_results ?? 3),
        "--min-score", "0.5"
      ];
      if (collection) args.push("--collection", String(collection));

      const proc = spawnSync("grounded-code-mcp", args, { encoding: "utf-8", timeout: 15000 });
      if (proc.error || proc.status !== 0) {
        return "[grounded-code-mcp unavailable — do not hallucinate; use [CANNOT COMPLETE] if uncertain]";
      }
      return formatChunks(JSON.parse(proc.stdout));
    }
  });

  pi.registerTool({
    name: "search_code_examples",
    description: "Search authoritative code examples in the knowledge base",
    parameters: {
      query: {
        type: "string",
        description: "Pattern or concept to find examples for"
      },
      language: {
        type: "string",
        description: "csharp | python | php | typescript | javascript",
        optional: true
      }
    },
    execute: async ({ query, language }) => {
      const args = ["search-code", String(query), "--json", "-n", "2"];
      if (language) args.push("--language", String(language));

      const proc = spawnSync("grounded-code-mcp", args, { encoding: "utf-8", timeout: 15000 });
      if (proc.error || proc.status !== 0) {
        return "[grounded-code-mcp unavailable — do not hallucinate; use [CANNOT COMPLETE] if uncertain]";
      }
      return formatChunks(JSON.parse(proc.stdout));
    }
  });
}

function formatChunks(result: unknown): string {
  if (!Array.isArray(result) || result.length === 0) {
    return "[No results found — do not hallucinate; use [CANNOT COMPLETE] if uncertain]";
  }
  return (result as Record<string, unknown>[])
    .map(r => `[Source: ${r["source_path"]}]\n${r["content"]}`)
    .join("\n\n---\n\n");
}
// <AI-Generated END>
