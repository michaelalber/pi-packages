// <AI-Generated START>
// Watches context usage and triggers Pi auto-compact at COMPACT_THRESHOLD.
// Warns at WARN_THRESHOLD so the user can save work before compaction.

const WARN_THRESHOLD = 0.70;
const COMPACT_THRESHOLD = 0.80;

export default function(pi: ExtensionAPI) {
  pi.on("context_updated", (_event, ctx) => {
    const usage = ctx.getContextUsage();
    if (!usage) return;

    const ratio = usage.used / usage.max;
    const pct = Math.round(ratio * 100);

    if (ratio >= COMPACT_THRESHOLD) {
      ctx.ui.notify(`Context at ${pct}% — triggering auto-compact`);
      ctx.compact();
    } else if (ratio >= WARN_THRESHOLD) {
      ctx.ui.notify(`Context at ${pct}% — approaching limit`);
    }
  });
}
// <AI-Generated END>
