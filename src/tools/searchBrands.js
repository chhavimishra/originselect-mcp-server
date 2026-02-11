/**
 * search_brands tool — discover brands by values, country, or category.
 * Returns only brand data from the discovery response.
 */

import { discoverProducts } from '../client.js';
import { shapeBrandsResponse } from '../responseShaper.js';
import { CANONICAL_VALUES, CANONICAL_COUNTRIES, CANONICAL_CATEGORIES } from '../types.js';

export const searchBrandsTool = {
  name: 'search_brands',
  description: `Search for ethical and origin-verified brands on OriginSelect. Filter by country of origin, ethical values (women-owned, b-corp, organic, etc.), and product category. Returns brand details including values, website, and product count.`,
  inputSchema: {
    type: 'object',
    properties: {
      country: {
        type: 'string',
        description: 'Country of origin to filter by',
        enum: ['Canada', 'USA']
      },
      values: {
        type: 'array',
        items: { type: 'string', enum: CANONICAL_VALUES },
        description: 'Ethical/ownership values to filter by'
      },
      category: {
        type: 'string',
        description: 'Product category the brand operates in',
        enum: CANONICAL_CATEGORIES
      },
      brand: {
        type: 'string',
        description: 'Brand name to look up directly'
      },
      market: {
        type: 'string',
        description: 'Market scope',
        enum: ['canada', 'global', 'all'],
        default: 'all'
      },
      limit: {
        type: 'number',
        description: 'Maximum number of brands to return (1-20)',
        default: 10
      }
    }
  }
};

export async function handleSearchBrands(args) {
  try {
    const apiResponse = await discoverProducts({
      country: args.country,
      values: args.values,
      category: args.category,
      brand: args.brand,
      market: args.market,
      limit: 1,              // Minimize product data
      brandsLimit: args.limit || 10,
      intentType: args.brand ? 'brand' : 'mixed'
    });

    return shapeBrandsResponse(apiResponse);
  } catch (error) {
    return { error: error.message };
  }
}
