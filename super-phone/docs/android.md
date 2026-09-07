# Android / HyperOS integration

Use Termux as the local runtime and Tasker as the deterministic Android automation layer.

## Required

- Termux
- Tasker (or another trusted automation app)
- Android notification permission where required
- Battery/background execution allowance for Termux/Tasker as needed

## Optional / high trust

Accessibility, ADB, or elevated permissions should only be enabled for a specific use case. They expand the attack surface and must not be treated as a default requirement.

## Local-only default

Keep the gateway bound to `127.0.0.1`. If remote access is later needed, use an authenticated encrypted tunnel and do not expose port 8787 directly to the public internet.
