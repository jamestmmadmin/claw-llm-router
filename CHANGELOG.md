# Changelog — TMM LLM Router (fork of claw-llm-router)

Based on [donnfelker/claw-llm-router](https://github.com/donnfelker/claw-llm-router) (MIT license).
Security audited: TMMOC-89 (2026-03-26). Verdict: SAFE.

## v1.0.0 — 2026-03-26

### TMM Fork Changes
- **Removed Chinese providers** (moonshot, minimax, deepseek) — PR #1, source: TMMOC-89 (no-Chinese-models policy)
- **Added OpenRouter as backend** — PR #1, source: TMMOC-89 (unified billing through OpenRouter)
- **Per-agent cost attribution** — PR #2, source: TMMOC-92 (agent:id/project:tag/tier:tier in OpenRouter user field)
- **Security audit completed** — TMMOC-89 (file-by-file, no telemetry, no exfiltration, npm matches GitHub)

### Benchmarks (TMMOC-90)
- Multi-turn 3-step task: $0.001 (router) vs $0.014 (no router) = 92% savings
- Real-world intake + reviews: $3.26 (router) vs ~$90 (old mega-session) = 96% savings
- Quality maintained, better context retention with router

### Configuration
All tiers route through OpenRouter:
```json
{
  "tiers": {
    "SIMPLE": "openrouter/google/gemini-2.0-flash-001",
    "MEDIUM": "openrouter/anthropic/claude-haiku-4.5",
    "COMPLEX": "openrouter/anthropic/claude-sonnet-4.6",
    "REASONING": "openrouter/anthropic/claude-sonnet-4.6"
  }
}
```

## v1.1.0 — In Progress

### Completed
1. **Passthrough mode** — PR #4, source: TMMOC-91. Trivial prompts (score < -0.15, len < 200) route to SIMPLE with no fallback chain. Extension pattern (`tmm-passthrough.ts`) wraps upstream classifier — merge-safe.

### Planned (each a separate PR)
2. **Provider abstraction** — configure baseUrl per provider: local Ollama, cloud OpenRouter, or mixed (TMMOC-91)
3. **Per-agent minimum tier** — Frontier Alicia always COMPLEX (TMMOC-91)
4. **Job-type presets** — code-review/content/data-processing have different tier mappings (TMMOC-91)
5. **Historical model stack** — economy preset with previous-gen models (TMMOC-91)
