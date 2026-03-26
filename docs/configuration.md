# Router Configuration

## Provider Setup

The router supports any OpenAI-compatible API endpoint. Configure where your models are.

### Cloud Only (OpenRouter)
```json
{
  "providers": {
    "cloud": {
      "type": "openai-compatible",
      "baseUrl": "https://openrouter.ai/api/v1",
      "apiKey": "from-env:OPENROUTER_API_KEY"
    }
  },
  "tiers": {
    "SIMPLE": { "provider": "cloud", "model": "google/gemini-2.0-flash-001" },
    "MEDIUM": { "provider": "cloud", "model": "anthropic/claude-haiku-4.5" },
    "COMPLEX": { "provider": "cloud", "model": "anthropic/claude-sonnet-4.6" }
  }
}
```

### Local Only (Ollama)
```json
{
  "providers": {
    "local": {
      "type": "openai-compatible",
      "baseUrl": "http://localhost:11434/v1"
    }
  },
  "tiers": {
    "SIMPLE": { "provider": "local", "model": "llama3.2:3b" },
    "MEDIUM": { "provider": "local", "model": "qwen2.5:14b" },
    "COMPLEX": { "provider": "local", "model": "deepseek-r1:32b" }
  }
}
```

### Mac Docker + Ollama Host
```json
{
  "providers": {
    "local": {
      "type": "openai-compatible",
      "baseUrl": "http://host.docker.internal:11434/v1"
    }
  },
  "tiers": {
    "SIMPLE": { "provider": "local", "model": "llama3.2:3b" },
    "MEDIUM": { "provider": "local", "model": "mistral:7b" },
    "COMPLEX": { "provider": "local", "model": "codestral:22b" }
  }
}
```

### Hybrid (Local + Cloud)
```json
{
  "providers": {
    "local": {
      "type": "openai-compatible",
      "baseUrl": "http://localhost:11434/v1"
    },
    "cloud": {
      "type": "openai-compatible",
      "baseUrl": "https://openrouter.ai/api/v1",
      "apiKey": "from-env:OPENROUTER_API_KEY"
    }
  },
  "tiers": {
    "SIMPLE": { "provider": "local", "model": "llama3.2:3b" },
    "MEDIUM": { "provider": "local", "model": "qwen2.5:14b" },
    "COMPLEX": { "provider": "cloud", "model": "anthropic/claude-sonnet-4.6" }
  }
}
```

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
