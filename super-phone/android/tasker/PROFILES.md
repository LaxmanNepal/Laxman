# Tasker bridge

Create these Tasks in Tasker. Keep execution deterministic and allowlisted.

## LAXMAN_HEALTH
HTTP Request: GET `${LSP_GATEWAY_URL}/health` with Authorization Bearer token.

## LAXMAN_COMMAND
1. Receive voice/text variable `%LAXMAN_COMMAND`.
2. HTTP POST `/command` with JSON `{ "command": "%LAXMAN_COMMAND", "source": "tasker" }`.
3. If response is `approval_required`, show a confirmation notification.

## WORK_MODE
Open only the apps you explicitly allow (for example browser, notes, terminal). Do not grant accessibility or shell access automatically.

## CREATOR_MODE
Open creator tools and apply notification/DND preferences only when the user has explicitly configured them.

## SECURITY
Do not put API keys in Tasker profile exports. Store the gateway token in Termux environment or another protected local secret store.

Modern Android/HyperOS may require user confirmation or additional permissions for some actions. Unsupported actions must fail closed.
