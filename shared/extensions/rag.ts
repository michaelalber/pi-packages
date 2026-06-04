// <AI-Generated START>
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
      const params: Record<string, unknown> = {
        query,
        n_results: n_results ?? 3,
        min_score: 0.5
      };
      if (collection) params["collection"] = collection;

      const result = await pi.callMcp("grounded-code-mcp", "search_knowledge", params);
      return formatChunks(result);
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
      const params: Record<string, unknown> = { query, n_results: 2 };
      if (language) params["language"] = language;

      const result = await pi.callMcp("grounded-code-mcp", "search_code_examples", params);
      return formatChunks(result);
    }
  });
}

function formatChunks(result: unknown): string {
  if (!Array.isArray(result) || result.length === 0) {
    return "[No results found — do not hallucinate; use [CANNOT COMPLETE] if uncertain]";
  }
  return result
    .map((r: Record<string, unknown>) => `[Source: ${r["source_path"]}]\n${r["content"]}`)
    .join("\n\n---\n\n");
}
// <AI-Generated END>
