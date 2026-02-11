/**
 * refine_search tool — modify a previous search without re-parsing intent.
 * Takes the intent from a prior search_products call and applies modifications.
 * Zero LLM cost — pure in-memory transformation on the backend.
 */

import { refineSearch } from '../client.js';
import { shapeProductsResponse } from '../responseShaper.js';
import { CANONICAL_VALUES, CANONICAL_CATEGORIES, CANONICAL_COUNTRIES } from '../types.js';

export const refineSearchTool = {
  name: 'refine_search',
  description: `Refine a previous product search by adding/removing filters. Takes the intent object from a prior search_products response and applies modifications. No new query parsing needed — this is a fast refinement.

Examples:
- Add a value: { action: "add", field: "values", value: "organic" }
- Remove a value: { action: "remove", field: "values", value: "vegan" }
- Change country: { action: "modify", field: "country", value: "Canada" }
- Set max price: { action: "modify", field: "priceMax", value: 30 }
- Change category: { action: "modify", field: "category", value: "Beauty" }`,
  inputSchema: {
    type: 'object',
    properties: {
      intent: {
        type: 'object',
        description: 'The intent object returned from a previous search_products call. Pass it unchanged.',
        properties: {
          intentType: { type: 'string' },
          country: { type: 'string' },
          category: { type: 'string' },
          values: { type: 'array', items: { type: 'string' } },
          keywords: { type: 'array', items: { type: 'string' } },
          brand: { type: 'string' },
          priceMax: { type: 'number' },
          priceMin: { type: 'number' },
          classification: { type: 'string' }
        }
      },
      modifications: {
        type: 'array',
        description: 'Array of modifications to apply to the intent',
        items: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['add', 'remove', 'modify'],
              description: '"add" to append a value/keyword, "remove" to strip one, "modify" to change a scalar field'
            },
            field: {
              type: 'string',
              enum: ['values', 'keywords', 'excludes', 'country', 'category', 'classification', 'priceMax', 'priceMin', 'market'],
              description: 'The intent field to modify'
            },
            value: {
              type: 'string',
              description: 'The value to add, remove, or set. Use strings for all fields (e.g., "30" for priceMax).'
            }
          },
          required: ['action', 'value']
        }
      },
      market: {
        type: 'string',
        enum: ['canada', 'global', 'all'],
        description: 'Market scope override'
      },
      limit: {
        type: 'number',
        description: 'Max products to return (1-50)',
        default: 12
      }
    },
    required: ['intent', 'modifications']
  }
};

export async function handleRefineSearch(args) {
  try {
    if (!args.intent) {
      return { error: 'Missing "intent" — pass the intent object from a previous search_products response' };
    }
    if (!args.modifications?.length) {
      return { error: 'Missing "modifications" — provide at least one modification' };
    }

    // Convert numeric string values for price fields
    const modifications = (args.modifications || []).map(mod => {
      if (['priceMax', 'priceMin'].includes(mod.field) && typeof mod.value === 'string') {
        return { ...mod, value: parseFloat(mod.value) };
      }
      return mod;
    });

    const apiResponse = await refineSearch({
      intent: args.intent,
      modifications,
      market: args.market,
      limit: args.limit
    });

    return shapeProductsResponse(apiResponse);
  } catch (error) {
    return { error: error.message };
  }
}
