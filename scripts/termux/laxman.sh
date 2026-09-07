#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE_URL="${LAXMAN_GATEWAY_URL:-http://127.0.0.1:8787}"
TOKEN="${LAXMAN_GATEWAY_TOKEN:?Set LAXMAN_GATEWAY_TOKEN first}"

command=${*:-"status"}

curl -fsS "$BASE_URL/command" \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  --data "$(python -c 'import json,sys; print(json.dumps({"text":" ".join(sys.argv[1:])}))' "$@")"
