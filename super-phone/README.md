# Laxman Super Phone

A security-first AI automation platform for Android + Termux + Tasker + GitHub.

## V1-V10

| Phase | Capability | Implementation |
|---|---|---|
| V1 | Control Center | Gateway, manifests, audit |
| V2 | Voice | Command envelope + Tasker bridge |
| V3 | Phone automation | Allowlisted Android actions |
| V4 | Agent fleet | Commander, Phone, Research, GitHub, Content, Website, NEPSE, Files, Memory |
| V5 | Personal automation | Modes and scheduled workflows |
| V6 | GitHub DevOps | Inspect -> branch -> PR -> CI -> approval |
| V7 | Cloud/local brain | Provider-neutral AI adapter + local execution |
| V8 | Event driven | Webhooks/events -> rules -> approvals |
| V9 | Multi-agent | Planner -> specialist -> verifier pattern |
| V10 | Autonomous OS | Bounded autonomy with hard security boundaries |

## Security model

L0 read-only; L1 low-risk; L2 sensitive/approval; L3 critical/manual approval.

AI never receives arbitrary shell execution, raw credentials, unrestricted device control, or direct merge authority.

## Runtime

- Node.js 20+
- Android + Termux
- Tasker for deterministic phone automation
- GitHub Actions for CI

See `docs/` and `config/` for contracts. Copy `gateway/.env.example` to `.env` and set a strong `LSP_GATEWAY_TOKEN`.

Default gateway: `127.0.0.1:8787`.
