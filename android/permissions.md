# Android permission policy

Grant only what the current automation needs.

## V1

- Tasker: notifications and the specific automation integrations used by profiles.
- Accessibility: only if a specific UI automation requires it; keep disabled otherwise.
- Location: only for location-triggered profiles.
- Termux: local scripts and HTTP client; do not store long-lived secrets in shell history.

## Rules

1. Do not enable unrestricted accessibility automation without a concrete workflow.
2. Do not expose the gateway to public networks without authentication and TLS.
3. Do not store GitHub PATs, AI keys, cookies, or banking credentials in this repository.
4. Critical actions require an explicit approval request.
