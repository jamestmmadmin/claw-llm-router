# Router Configuration

Config file: `router-config.json` in the plugin directory.

## Config Format

```json
{
  "providers": {
    "<name>": {
      "baseUrl": "http://...",
      "apiKeyEnv": "MY_API_KEY",
      "noAuth": false
    }
  },
  "tiers": {
    "SIMPLE": "<provider>/<model-id>",
    "MEDIUM": "<provider>/<model-id>",
    "COMPLEX": "<provider>/<model-id>",
    "REASONING": "<provider>/<model-id>"
  }
}
```

- **providers** (optional) — custom provider definitions with `baseUrl`. If omitted, the router uses well-known URLs for standard providers (openrouter, anthropic, google, openai, etc).
- **tiers** — maps each complexity tier to `provider/model-id`. The provider name is the first segment before `/`.

### Provider fields

| Field | Required | Description |
|-------|----------|-------------|
| `baseUrl` | Yes | OpenAI-compatible API endpoint |
| `apiKeyEnv` | No | Env var name for API key (default: `${PROVIDER}_API_KEY`, e.g. `OPENAI_API_KEY`) |
| `noAuth` | No | Set `true` for local providers that need no API key (e.g. Ollama) |

## Examples

### Cloud Only (OpenRouter)

No `providers` section needed — OpenRouter is a well-known provider.

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

API key: set `OPENROUTER_API_KEY` env var or add to OpenClaw auth profiles.

### Local Only (Ollama)

```json
{
  "providers": {
    "ollama": {
      "baseUrl": "http://localhost:11434/v1",
      "noAuth": true
    }
  },
  "tiers": {
    "SIMPLE": "ollama/llama3.2:3b",
    "MEDIUM": "ollama/qwen2.5:14b",
    "COMPLEX": "ollama/codestral:22b",
    "REASONING": "ollama/codestral:22b"
  }
}
```

No API key needed — `noAuth: true` skips key lookup.

### Mac Docker + Ollama on Host

When OpenClaw runs in Docker and Ollama runs on the host Mac:

```json
{
  "providers": {
    "ollama": {
      "baseUrl": "http://host.docker.internal:11434/v1",
      "noAuth": true
    }
  },
  "tiers": {
    "SIMPLE": "ollama/llama3.2:3b",
    "MEDIUM": "ollama/mistral:7b",
    "COMPLEX": "ollama/codestral:22b",
    "REASONING": "ollama/codestral:22b"
  }
}
```

### Hybrid (Local + Cloud)

Simple/medium tasks run locally, complex tasks go to cloud:

```json
{
  "providers": {
    "ollama": {
      "baseUrl": "http://localhost:11434/v1",
      "noAuth": true
    }
  },
  "tiers": {
    "SIMPLE": "ollama/llama3.2:3b",
    "MEDIUM": "ollama/qwen2.5:14b",
    "COMPLEX": "openrouter/anthropic/claude-sonnet-4.6",
    "REASONING": "openrouter/anthropic/claude-sonnet-4.6"
  }
}
```

OpenRouter is well-known so no provider def needed. Ollama needs one for the custom baseUrl.

### Custom Provider (LM Studio, vLLM, etc.)

```json
{
  "providers": {
    "lmstudio": {
      "baseUrl": "http://192.168.1.100:1234/v1",
      "noAuth": true
    }
  },
  "tiers": {
    "SIMPLE": "lmstudio/my-local-model",
    "MEDIUM": "lmstudio/my-local-model",
    "COMPLEX": "openrouter/anthropic/claude-sonnet-4.6",
    "REASONING": "openrouter/anthropic/claude-sonnet-4.6"
  }
}
```

## Provider Resolution Order

When resolving a provider's baseUrl:
1. `router-config.json` providers section (custom definitions)
2. `openclaw.json` models.providers (OpenClaw config)
3. Well-known URLs (openrouter, anthropic, google, openai, groq, mistral, etc.)

## Install

```bash
openclaw plugins install claw-llm-router
openclaw plugins enable claw-llm-router
# Edit extensions/claw-llm-router/router-config.json with your tiers
systemctl restart openclaw  # or docker restart openclaw
```

## Security

Full audit: TMMOC-89. No telemetry, no exfiltration, no suspicious deps.
Chinese providers removed (moonshot, minimax, deepseek).
Proxy binds localhost only (127.0.0.1:8401).
