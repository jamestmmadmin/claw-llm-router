/**
 * TMM Extension — Passthrough Mode
 *
 * Wraps the upstream classifier to detect trivially simple prompts
 * (score < PASSTHROUGH_THRESHOLD) and marks them for passthrough routing.
 *
 * Passthrough means: route to SIMPLE tier with NO fallback chain.
 * This avoids unnecessary model escalation for greetings, yes/no, etc.
 *
 * This file is a TMM extension — upstream changes to classifier.ts
 * won't conflict because we wrap rather than modify.
 *
 * TMMOC-91: Router v1.1 — passthrough mode
 */

import { classify, type ClassificationResult } from "./classifier.js";

// ── Configuration ────────────────────────────────────────────────────────────

/**
 * Score threshold below which a prompt is considered trivially simple.
 * The classifier returns negative scores for very simple prompts
 * (e.g. "hello" → simpleIndicators = -1.0 × 0.11 weight = -0.11).
 *
 * A composite score below -0.15 means multiple simple signals fired
 * with zero complexity signals — safe to skip fallback overhead.
 *
 * Threshold is intentionally conservative to avoid misrouting.
 * -0.15 catches: "hello", "yes", "what is X", "define Y", "who is Z"
 * -0.15 does NOT catch: any prompt with even one complexity signal
 */
const PASSTHROUGH_THRESHOLD = -0.15;

/**
 * Maximum prompt length (chars) eligible for passthrough.
 * Even a low score on a long prompt suggests embedded context
 * that the classifier may not fully capture.
 */
const PASSTHROUGH_MAX_LENGTH = 200;

// ── Extended result type ─────────────────────────────────────────────────────

export type ExtendedClassificationResult = ClassificationResult & {
  /** True if the prompt is trivially simple and should skip fallback routing */
  passthrough: boolean;
};

// ── Wrapper ──────────────────────────────────────────────────────────────────

/**
 * Classify a prompt with passthrough detection.
 *
 * Calls the upstream classifier, then checks if the result qualifies
 * for passthrough (score below threshold + short prompt + SIMPLE tier).
 *
 * Passthrough prompts route to SIMPLE with a single-element fallback chain,
 * avoiding unnecessary escalation to MEDIUM/COMPLEX on provider failure.
 */
export function classifyWithPassthrough(
  prompt: string,
  systemPrompt?: string,
): ExtendedClassificationResult {
  const result = classify(prompt, systemPrompt);

  const passthrough =
    result.tier === "SIMPLE" &&
    result.score < PASSTHROUGH_THRESHOLD &&
    prompt.length <= PASSTHROUGH_MAX_LENGTH;

  if (passthrough) {
    result.signals.push(
      `passthrough (score=${result.score.toFixed(3)}, len=${prompt.length})`,
    );
  }

  return { ...result, passthrough };
}
