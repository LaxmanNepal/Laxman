# Voice + AI contract

The gateway accepts a normalized command envelope:

```json
{
  "command":"check github",
  "source":"voice",
  "request_id":"uuid",
  "context":{}
}
```

AI providers should only return plans/commands that are valid against `config/agents.json` and `config/permissions.json`.

Recommended flow:

1. Android speech-to-text.
2. AI intent normalization.
3. Gateway authentication.
4. Command allowlist lookup.
5. Permission classification.
6. Execute L0/L1 or create approval for L2/L3.
7. Audit.
8. Return result to Tasker/dashboard.

The AI layer must never receive or output gateway tokens, GitHub secrets, passwords, or private credentials.
