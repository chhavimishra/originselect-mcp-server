/**
 * Shared types for OriginSelect MCP Server.
 * These map to the canonical constants in the backend's intentValidator.js.
 */

export const CANONICAL_VALUES = [
  'women-owned', 'black-owned', 'indigenous-owned', 'latino-owned', 'aapi-owned',
  'veteran-owned', 'family-owned', 'lgbtq-owned', 'minority-owned',
  'b-corp', 'organic', 'sustainable', 'vegan', 'non-gmo', 'fair-trade', 'social-impact',
  'fragrance-free', 'plastic-free', 'cruelty-free', 'non-toxic', 'gluten-free'
];

export const CANONICAL_COUNTRIES = [
  'Canada', 'USA'
];

export const CANONICAL_CATEGORIES = [
  'Beauty', 'Personal Care', 'Baby', 'Health & Wellness', 'Supplements',
  'Home & Kitchen', 'Cleaning', 'Food & Grocery', 'Beverages', 'Pet Care',
  'Fashion', 'Accessories', 'Electronics', 'Office', 'Outdoors', 'Sports', 'Toys'
];

export const CANONICAL_CLASSIFICATIONS = [
  'fully-canadian', 'canadian-manufactured', 'canadian-operations'
];

export const VALUE_LABELS = {
  'women-owned': 'Women-Owned',
  'black-owned': 'Black-Owned',
  'indigenous-owned': 'Indigenous-Owned',
  'latino-owned': 'Latino-Owned',
  'aapi-owned': 'AAPI-Owned',
  'veteran-owned': 'Veteran-Owned',
  'family-owned': 'Family-Owned',
  'lgbtq-owned': 'LGBTQ+-Owned',
  'minority-owned': 'Minority-Owned',
  'b-corp': 'B Corp Certified',
  'organic': 'Organic',
  'sustainable': 'Sustainable',
  'vegan': 'Vegan',
  'non-gmo': 'Non-GMO',
  'fair-trade': 'Fair Trade',
  'social-impact': 'Social Impact',
  'fragrance-free': 'Fragrance-Free',
  'plastic-free': 'Plastic-Free',
  'cruelty-free': 'Cruelty-Free',
  'non-toxic': 'Non-Toxic',
  'gluten-free': 'Gluten-Free'
};
