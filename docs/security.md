# Security model

## Trust levels

- L0 Read-only: public research, status, inspection.
- L1 Low-risk: predefined phone modes, app launches, reminders, notifications.
- L2 Sensitive: messages, repository writes, uploads; require explicit approval where configured.
- L3 Critical: financial actions, account security changes, destructive operations; always require explicit human approval.

## Gateway rules

- Bearer token authentication is mandatory for non-health endpoints.
- Token comparison uses constant-time comparison.
- Request bodies are size-limited.
- Approval requests expire.
- Audit events are kept in memory in V1; production V2 should use an encrypted persistent store with rotation.
- No arbitrary shell endpoint exists.
- No credentials are stored in manifests.

## GitHub rules

The agent may inspect repositories and prepare branches/PRs, but merging or writing directly to the default branch is an approval-gated capability. Prefer GitHub App installation permissions or fine-grained tokens with the smallest possible repository scope.
