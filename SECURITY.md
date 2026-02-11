# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this MCP server, please report it responsibly.

**Email:** chhavi.mishra@gmail.com

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact

We will respond within 48 hours and aim to resolve confirmed issues within 7 days.

## What This Package Does

This MCP server is a **read-only client** that sends HTTPS requests to the OriginSelect Discovery API (`api.originselect.com`). It:

- **Does NOT** access your filesystem, environment variables (beyond `API_BASE_URL`), or local data
- **Does NOT** send any user data, credentials, or telemetry to third parties
- **Does NOT** execute arbitrary code or shell commands
- **Only** makes outbound HTTPS POST requests to `api.originselect.com`

## Verification

This package is open source. You can audit the complete source code:

- [src/client.js](src/client.js) — the only file that makes HTTP requests
- [src/index.js](src/index.js) — MCP server entry point
- All outbound requests go exclusively to `API_BASE_URL` (default: `https://api.originselect.com`)

## Dependency Policy

This package has a single runtime dependency: `@modelcontextprotocol/sdk` (the official MCP SDK by Anthropic). We keep dependencies minimal to reduce supply chain risk.
