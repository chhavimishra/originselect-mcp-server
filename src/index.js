#!/usr/bin/env node

/**
 * OriginSelect MCP Server
 * 
 * Model Context Protocol server for AI agent access to OriginSelect's
 * Discovery API. Exposes 6 tools:
 * 
 *   search_products  — Find ethical, origin-verified products
 *   search_brands    — Discover brands by values, country, category
 *   refine_search    — Modify a previous search (add/remove filters)
 *   get_values       — List all supported ethical values
 *   get_categories   — List all supported product categories
 *   get_countries    — List all supported countries of origin
 * 
 * All product/brand queries use structured parameters for
 * fast, efficient search.
 * 
 * Usage:
 *   npx @originselect/mcp-server
 *   API_BASE_URL=https://your-api.com node src/index.js
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';

// ─── Tool Imports ───────────────────────────────────────────────────────────

import { searchProductsTool, handleSearchProducts } from './tools/searchProducts.js';
import { searchBrandsTool, handleSearchBrands } from './tools/searchBrands.js';
import { refineSearchTool, handleRefineSearch } from './tools/refineSearch.js';
import {
  getValuesTool, handleGetValues,
  getCategoriesTool, handleGetCategories,
  getCountriesTool, handleGetCountries
} from './tools/staticData.js';

// ─── Server Setup ───────────────────────────────────────────────────────────

function createServer() {
  const server = new Server(
    {
      name: 'originselect-discovery',
      version: '1.0.0'
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  // ─── List Tools ─────────────────────────────────────────────────────────────

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      searchProductsTool,
      searchBrandsTool,
      refineSearchTool,
      getValuesTool,
      getCategoriesTool,
      getCountriesTool
    ]
  }));

  // ─── Call Tool ──────────────────────────────────────────────────────────────

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    let result;

    switch (name) {
      case 'search_products':
        result = await handleSearchProducts(args || {});
        break;

      case 'search_brands':
        result = await handleSearchBrands(args || {});
        break;

      case 'refine_search':
        result = await handleRefineSearch(args || {});
        break;

      case 'get_values':
        result = handleGetValues();
        break;

      case 'get_categories':
        result = handleGetCategories();
        break;

      case 'get_countries':
        result = handleGetCountries();
        break;

      default:
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ error: `Unknown tool: ${name}` })
          }],
          isError: true
        };
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }]
    };
  });

  // ─── Error Handling ──────────────────────────────────────────────────────────

  server.onerror = (error) => {
    console.error('[originselect-mcp] Error:', error);
  };

  return server;
}

// ─── Smithery Sandbox Export ────────────────────────────────────────────────

export function createSandboxServer() {
  return createServer();
}

process.on('SIGINT', async () => {
  await server.close();
  process.exit(0);
});

// ─── Start ──────────────────────────────────────────────────────────────────

async function main() {
  const server = createServer();

  process.on('SIGINT', async () => {
    await server.close();
    process.exit(0);
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[originselect-mcp] Server running on stdio');
}

main().catch((error) => {
  console.error('[originselect-mcp] Fatal error:', error);
  process.exit(1);
});
