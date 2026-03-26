/**
 * TMM Extension — Per-Agent Minimum Tier
 *
 * Some agents should never be routed below a certain tier.
 * E.g. Frontier Alicia (project-manager-lead) always needs COMPLEX
 * because she handles multi-agent coordination and strategic decisions.
 *
 * Config lives in router-config.json under "agentMinTiers".
 * Falls back to no override if not configured.
 *
 * This file is a TMM extension — upstream changes won't conflict.
 *
 * TMMOC-91: Router v1.1 — per-agent minimum tier
 */

import type { Tier } from "./classifier.js";

// ── Tier ordering (for comparison) ───────────────────────────────────────────

const TIER_ORDER: Record<Tier, number> = {
  SIMPLE: 0,
  MEDIUM: 1,
  COMPLEX: 2,
  REASONING: 3,
};

function parseTier(s: string): Tier | undefined {
  const upper = s.toUpperCase();
  if (upper in TIER_ORDER) return upper as Tier;
  return undefined;
}

// ── Config type ──────────────────────────────────────────────────────────────

export type AgentMinTierConfig = Record<string, string>;

// ── Core logic ───────────────────────────────────────────────────────────────

/**
 * Apply per-agent minimum tier override.
 *
 * If the agent has a configured minimum tier that is higher than the
 * classified tier, bump up to the minimum. Otherwise return the
 * classified tier unchanged.
 *
 * @param classifiedTier - tier from the classifier
 * @param agentId - agent identifier extracted from system prompt (or null)
 * @param config - agentMinTiers from router-config.json
 * @returns { tier, wasOverridden }
 */
export function applyAgentMinTier(
  classifiedTier: Tier,
  agentId: string | null,
  config: AgentMinTierConfig | undefined,
): { tier: Tier; wasOverridden: boolean; minTier?: Tier } {
  if (!agentId || !config) {
    return { tier: classifiedTier, wasOverridden: false };
  }

  const minTierStr = config[agentId];
  if (!minTierStr) {
    return { tier: classifiedTier, wasOverridden: false };
  }

  const minTier = parseTier(minTierStr);
  if (!minTier) {
    return { tier: classifiedTier, wasOverridden: false };
  }

  if (TIER_ORDER[classifiedTier] < TIER_ORDER[minTier]) {
    return { tier: minTier, wasOverridden: true, minTier };
  }

  return { tier: classifiedTier, wasOverridden: false, minTier };
}
