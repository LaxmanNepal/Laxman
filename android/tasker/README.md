# Tasker integration

V1 uses Tasker as the Android trigger/executor and the gateway as the policy boundary.

## Profile: Laxman Command

1. Trigger: Tasker widget, Quick Settings tile, or voice action.
2. Action: Variable Set `%LAXMAN_TEXT` to the requested command.
3. Action: HTTP Request -> POST `http://127.0.0.1:8787/command`.
4. Header: `Authorization: Bearer <your gateway token>`.
5. Header: `Content-Type: application/json`.
6. Body: `{ "text": "%LAXMAN_TEXT" }`.
7. Notify the returned JSON.

Prefer loopback (`127.0.0.1`) when the gateway runs locally. If you expose it on Wi-Fi, use HTTPS/reverse proxy and a long random token; never expose an unauthenticated gateway to the internet.

## Suggested triggers

- `work mode` -> `automation.trigger`
- `creator mode` -> `automation.trigger`
- `check github` -> `github.read`
- `research <topic>` -> `web.research`

V1 intentionally does not grant Tasker a generic shell-execution endpoint.
