# Laxman Super Phone

AI-powered Android automation control plane for Laxman.

## V1

- Node.js zero-dependency local gateway
- Agent manifests with explicit permissions
- Security gate with approval-required actions
- Termux command client
- Tasker HTTP integration examples
- GitHub Actions CI
- Audit logging

## Architecture

Android (Tasker/Termux) -> Gateway -> Agent Router -> Security Gate -> deterministic tools / future AI providers.

The gateway intentionally does **not** execute arbitrary shell commands or expose unrestricted GitHub credentials. High-risk operations return an approval request instead of executing.

## Run

```bash
cd gateway
cp .env.example .env
export LAXMAN_GATEWAY_TOKEN='replace-with-a-long-random-secret'
node server.js
```

Health: `GET http://127.0.0.1:8787/health`

Command:

```bash
curl -X POST http://127.0.0.1:8787/command \
  -H 'Authorization: Bearer replace-with-a-long-random-secret' \
  -H 'Content-Type: application/json' \
  -d '{"text":"check github"}'
```

## Android

Import the Tasker HTTP examples from `android/tasker/` or reproduce them manually. Termux can call the gateway using `scripts/termux/laxman.sh`.

## Security

See `docs/security.md`. Never commit API keys, GitHub PATs, cookies, or personal credentials.
