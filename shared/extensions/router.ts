// <AI-Generated START>
// Routes to PC or Mac Mini based on message complexity heuristic.
// Override at any time with Ctrl+L model cycling.

const THRESHOLDS = {
  simple: 150,  // stay on current machine (fast local model)
  medium: 500   // PC primary; above → Mac Mini
} as const;

const MODELS = {
  pc: "pc/phi4:14b",
  macMini: "mac-mini/codestral:22b"
} as const;

export default function(pi: ExtensionAPI) {
  pi.on("session_start", async (_event, ctx) => {
    const len = ctx.message?.length ?? 0;

    if (len < THRESHOLDS.simple) return; // fast local — no switch

    const target = len < THRESHOLDS.medium ? MODELS.pc : MODELS.macMini;
    await ctx.setModel(target);
    ctx.notify(`Routed to ${target} (message length: ${len})`);
  });
}
// <AI-Generated END>
