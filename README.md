# OriginSelect MCP Server

Model Context Protocol server for [OriginSelect](https://originselect.com) — search ethical, origin-verified products and brands via AI agents.

Works with Claude Desktop, Cursor, Windsurf, and any MCP-compatible client.

## Quick Start

```bash
cd originselect-mcp-server
npm install
```

### Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "originselect": {
      "command": "node",
      "args": ["/absolute/path/to/originselect-mcp-server/src/index.js"],
      "env": {
        "API_BASE_URL": "https://api.originselect.com"
      }
    }
  }
}
```

### Cursor / Windsurf

Add to your MCP settings:

```json
{
  "originselect": {
    "command": "node",
    "args": ["./originselect-mcp-server/src/index.js"],
    "env": {
      "API_BASE_URL": "https://api.originselect.com"
    }
  }
}
```

## Tools

### `search_products`

Search the curated product catalog by values, country, category, brand, or keywords.

```
"Find organic baby products from Canada under $25"
→ { country: "Canada", category: "Baby", values: ["organic"], priceMax: 25 }
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | string | Optional NL query for context |
| `country` | string | Country of origin (Canada, USA) |
| `category` | string | Product category (Beauty, Baby, Pet Care, etc.) |
| `values` | string[] | Ethical values (women-owned, organic, b-corp, etc.) |
| `brand` | string | Brand name |
| `keywords` | string[] | Product keywords (shampoo, coffee, etc.) |
| `priceMax` | number | Maximum price in dollars |
| `market` | string | `canada`, `global`, or `all` (default: all) |
| `limit` | number | Max products (1-50, default: 12) |

### `search_brands`

Discover brands by ethical values, country, or category.

| Parameter | Type | Description |
|-----------|------|-------------|
| `country` | string | Country of origin |
| `values` | string[] | Ethical values |
| `category` | string | Product category |
| `brand` | string | Brand name to look up |
| `market` | string | Market scope |
| `limit` | number | Max brands (1-20, default: 10) |

### `refine_search`

Refine a previous search by adding/removing filters. Takes the `intent` object from a prior `search_products` response and applies modifications — no need to re-query from scratch.

```json
{
  "intent": { "...from previous response..." },
  "modifications": [
    { "action": "add", "field": "values", "value": "organic" },
    { "action": "remove", "field": "values", "value": "vegan" },
    { "action": "modify", "field": "priceMax", "value": 30 }
  ]
}
```

### `get_values`

List all 21 supported ethical/ownership values (women-owned, b-corp, organic, etc.).

### `get_categories`

List all 17 supported product categories.

### `get_countries`

List all supported countries of origin (currently Canada and USA).

## Architecture

```
AI Agent (Claude, GPT, Cursor)
    │
    │  MCP (stdio)
    ▼
┌─────────────────────────┐
│  MCP Server (this pkg)  │
│  6 tools                │
└───────────┬─────────────┘
            │  HTTPS
            ▼
┌─────────────────────────┐
│  OriginSelect API       │
│  api.originselect.com   │
└─────────────────────────┘
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `API_BASE_URL` | `https://api.originselect.com` | Discovery API base URL |

## Supported Values

```
women-owned · black-owned · indigenous-owned · veteran-owned
family-owned · lgbtq-owned · aapi-owned · latino-owned · minority-owned
b-corp · organic · sustainable · vegan · non-gmo · fair-trade
non-toxic · cruelty-free · fragrance-free · plastic-free
social-impact · gluten-free
```

## Security & Trust

This MCP server is **open source** and fully auditable:

- **Read-only** — only makes outbound HTTPS requests to `api.originselect.com`
- **No filesystem access** — does not read or write any local files
- **No telemetry** — does not send user data or analytics anywhere
- **Minimal dependencies** — single runtime dependency (`@modelcontextprotocol/sdk`)
- **Source code** — [github.com/chhavimishra/originselect-mcp-server](https://github.com/chhavimishra/originselect-mcp-server)

See [SECURITY.md](SECURITY.md) for vulnerability reporting.

## License

MIT
