/**
 * search_products tool — the primary discovery tool.
 * Sends structured intent to POST /api/ai/discover (zero LLM cost path).
 */

import { discoverProducts } from '../client.js';
import { shapeProductsResponse } from '../responseShaper.js';
import { CANONICAL_VALUES, CANONICAL_COUNTRIES, CANONICAL_CATEGORIES, CANONICAL_CLASSIFICATIONS } from '../types.js';

export const searchProductsTool = {
  name: 'search_products',
  description: `Search OriginSelect's curated catalog of ethical, origin-verified products. Filter by country of origin, ethical values (e.g., women-owned, organic, b-corp), product category, brand, and price. Returns scored and ranked results with match reasons.`,
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Optional natural language query for context (e.g., "non-toxic baby shampoo from Canada"). Structured fields below take precedence.'
      },
      country: {
        type: 'string',
        description: 'Country of origin to filter by',
        enum: ['Canada', 'USA']
      },
      category: {
        type: 'string',
        description: 'Product category',
        enum: CANONICAL_CATEGORIES
      },
      values: {
        type: 'array',
        items: { type: 'string', enum: CANONICAL_VALUES },
        description: 'Ethical/ownership values to filter by (e.g., ["women-owned", "organic", "non-toxic"])'
      },
      brand: {
        type: 'string',
        description: 'Brand name to search for'
      },
      keywords: {
        type: 'array',
        items: { type: 'string' },
        description: 'Specific product keywords (e.g., ["shampoo", "moisturizer"])'
      },
      priceMax: {
        type: 'number',
        description: 'Maximum price in dollars'
      },
      classification: {
        type: 'string',
        description: 'Canadian brand classification filter',
        enum: CANONICAL_CLASSIFICATIONS
      },
      market: {
        type: 'string',
        description: 'Market scope: "canada" for Canadian products only, "global" for international, "all" for both',
        enum: ['canada', 'global', 'all'],
        default: 'all'
      },
      limit: {
        type: 'number',
        description: 'Maximum number of products to return (1-50)',
        default: 12
      }
    }
  }
};

export async function handleSearchProducts(args) {
  try {
    const apiResponse = await discoverProducts({
      query: args.query,
      country: args.country,
      category: args.category,
      values: args.values,
      brand: args.brand,
      keywords: args.keywords,
      priceMax: args.priceMax,
      classification: args.classification,
      market: args.market,
      limit: args.limit,
      intentType: 'product'
    });

    return shapeProductsResponse(apiResponse);
  } catch (error) {
    return { error: error.message };
  }
}
