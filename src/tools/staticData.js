/**
 * Static data tools — get_values and get_categories.
 * No API call needed — returns hardcoded canonical lists.
 */

import { CANONICAL_VALUES, CANONICAL_COUNTRIES, CANONICAL_CATEGORIES, VALUE_LABELS } from '../types.js';

export const getValuesTool = {
  name: 'get_values',
  description: 'List all supported ethical/ownership values that can be used to filter products and brands. Returns canonical value tokens with display labels.',
  inputSchema: {
    type: 'object',
    properties: {}
  }
};

export function handleGetValues() {
  return {
    values: CANONICAL_VALUES.map(v => ({
      token: v,
      label: VALUE_LABELS[v] || v
    })),
    total: CANONICAL_VALUES.length,
    usage: 'Pass the "token" values in the "values" array when calling search_products or search_brands.'
  };
}

export const getCategoriesTool = {
  name: 'get_categories',
  description: 'List all supported product categories that can be used to filter products and brands.',
  inputSchema: {
    type: 'object',
    properties: {}
  }
};

export function handleGetCategories() {
  return {
    categories: CANONICAL_CATEGORIES,
    total: CANONICAL_CATEGORIES.length,
    usage: 'Pass a category name in the "category" field when calling search_products or search_brands.'
  };
}

export const getCountriesTool = {
  name: 'get_countries',
  description: 'List all supported countries of origin that can be used to filter products and brands. Currently supports Canada and USA.',
  inputSchema: {
    type: 'object',
    properties: {}
  }
};

export function handleGetCountries() {
  return {
    countries: CANONICAL_COUNTRIES,
    total: CANONICAL_COUNTRIES.length,
    usage: 'Pass a country name in the "country" field when calling search_products or search_brands.'
  };
}
