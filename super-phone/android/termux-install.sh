#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
pkg update -y
pkg install -y nodejs curl git jq
mkdir -p "$HOME/.laxman"
cp "$(dirname "$0")/../scripts/termux/lsp" "$HOME/.laxman/lsp"
chmod +x "$HOME/.laxman/lsp"
cat <<'EOF'

Laxman Super Phone bootstrap complete.
Set:
  export LSP_GATEWAY_URL=http://127.0.0.1:8787
  export LSP_GATEWAY_TOKEN='your-long-random-token'
Then run:
  ~/.laxman/lsp health
EOF
