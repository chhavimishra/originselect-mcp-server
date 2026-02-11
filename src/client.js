/**
 * HTTP Client for OriginSelect Discovery API.
 * Sends requests to the backend with structured intent (zero LLM cost path).
 */

const API_BASE = process.env.API_BASE_URL || 'https://api.originselect.com';

/**
 * Call POST /api/ai/discover with structured intent bypass.
 * Passes structuredIntent directly — the backend skips the LLM intent parser.
 */
export async function discoverProducts(params) {
  const {
    query, country, category, values, brand, keywords,
    priceMax, priceMin, market, limit, brandsLimit, collectionsLimit,
    classification, intentType
  } = params;

  const body = {
    // If query is provided, include it (useful for NL fallback).
    // The structuredIntent takes precedence and skips LLM.
    query: query || buildQueryLabel(params),
    market: market || 'all',
    limit: limit || 12,
    brandsLimit: brandsLimit ?? 5,
    collectionsLimit: collectionsLimit ?? 3,

    // ── Structured intent bypass (zero LLM cost) ──
    structuredIntent: {
      intentType: intentType || 'product',
      country: country || null,
      category: category || null,
      values: values || [],
      keywords: keywords || [],
      brand: brand || null,
      priceMin: priceMin || null,
      priceMax: priceMax || null,
      classification: classification || null,
      excludes: [],
      subcategory: null,
      sourceBrand: null,
      sourceProduct: null,
      industry: null
    }
  };

  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'OriginSelect-MCP/1.0'
  };

  const response = await fetch(`${API_BASE}/api/ai/discover`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000)
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`API returned ${response.status}: ${errorText}`);
  }

  return response.json();
}

/**
 * Call POST /api/ai/refine with intent modifications.
 * No LLM call — pure in-memory transformation on the backend.
 */
export async function refineSearch(params) {
  const { intent, modifications, market, limit, brandsLimit, collectionsLimit } = params;

  const body = {
    intent,
    modifications,
    market: market || intent.market || 'all',
    limit: limit || 12,
    brandsLimit: brandsLimit ?? 5,
    collectionsLimit: collectionsLimit ?? 3
  };

  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'OriginSelect-MCP/1.0'
  };

  const response = await fetch(`${API_BASE}/api/ai/refine`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000)
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`API returned ${response.status}: ${errorText}`);
  }

  return response.json();
}

/**
 * Build a human-readable label from structured params.
 * Used as the `query` field for logging/session purposes.
 */
function buildQueryLabel(params) {
  const parts = [];
  if (params.values?.length) parts.push(params.values.join(', '));
  if (params.category) parts.push(params.category);
  if (params.keywords?.length) parts.push(params.keywords.join(' '));
  if (params.brand) parts.push(`by ${params.brand}`);
  if (params.country) parts.push(`from ${params.country}`);
  if (params.priceMax) parts.push(`under $${params.priceMax}`);
  return parts.join(' ') || 'product search';
}
