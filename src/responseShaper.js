/**
 * Response shaping for MCP tool outputs.
 * Strips frontend-specific fields and simplifies for agent consumption.
 */

/**
 * Shape a discover/refine API response for agent consumption.
 * Removes frontend-only concerns: refineChips, suggestedQueries, internal IDs, etc.
 */
export function shapeProductsResponse(apiResponse) {
  if (!apiResponse || !apiResponse.success) {
    return {
      error: apiResponse?.error || 'Request failed',
      message: apiResponse?.message || 'Unable to retrieve products'
    };
  }

  const products = (apiResponse.products || []).map(p => ({
    name: p.name || p.title || '',
    brand: p.brand || p.brand_extracted || '',
    category: p.category || '',
    country: p.country || '',
    price: p.price || p.currentPrice || null,
    values: extractProductValues(p),
    description: p.description || '',
    purchaseUrl: p.affiliateUrl || p.sourceUrl || p.url || null,
    imageUrl: p.imageUrl || p.image || null,
    matchScore: p.matchScore || null,
    matchReasons: p.matchReasons || []
  }));

  const brands = (apiResponse.brands || []).map(b => ({
    name: b.brandName || b.name || '',
    country: b.country || '',
    values: b.values || b.classificationTags || [],
    website: b.website || null,
    productCount: b.productCount || 0,
    matchScore: b.matchScore || null,
    matchReasons: b.matchReasons || []
  }));

  const collections = (apiResponse.collections || []).map(c => ({
    title: c.title || c.name || '',
    description: c.description || '',
    productCount: c.productCount || c.products?.length || 0,
    matchScore: c.matchScore || null
  }));

  return {
    summary: apiResponse.summary || '',
    products,
    brands,
    collections,
    intent: apiResponse.intent || null,
    totalProducts: apiResponse.meta?.totalProducts || products.length,
    latencyMs: apiResponse.meta?.latencyMs || null
  };
}

/**
 * Shape a response returning only brands.
 */
export function shapeBrandsResponse(apiResponse) {
  if (!apiResponse || !apiResponse.success) {
    return {
      error: apiResponse?.error || 'Request failed',
      message: apiResponse?.message || 'Unable to retrieve brands'
    };
  }

  const brands = (apiResponse.brands || []).map(b => ({
    name: b.brandName || b.name || '',
    country: b.country || '',
    values: b.values || b.classificationTags || [],
    website: b.website || null,
    description: b.description || null,
    productCount: b.productCount || 0,
    matchScore: b.matchScore || null,
    matchReasons: b.matchReasons || []
  }));

  return {
    summary: apiResponse.summary || '',
    brands,
    totalBrands: brands.length,
    latencyMs: apiResponse.meta?.latencyMs || null
  };
}

/**
 * Extract product values from various field formats.
 */
function extractProductValues(product) {
  // Products may store values in different formats
  if (Array.isArray(product.values)) return product.values;

  const values = [];
  const valueFlags = [
    'womenOwned', 'blackOwned', 'indigenousOwned', 'latinoOwned', 'aapiOwned',
    'veteranOwned', 'familyOwned', 'lgbtqOwned', 'minorityOwned',
    'bCorp', 'organic', 'sustainable', 'vegan', 'nonGmo', 'fairTrade',
    'socialImpact', 'fragranceFree', 'plasticFree', 'crueltyFree', 'nonToxic', 'glutenFree'
  ];
  const valueLabels = [
    'women-owned', 'black-owned', 'indigenous-owned', 'latino-owned', 'aapi-owned',
    'veteran-owned', 'family-owned', 'lgbtq-owned', 'minority-owned',
    'b-corp', 'organic', 'sustainable', 'vegan', 'non-gmo', 'fair-trade',
    'social-impact', 'fragrance-free', 'plastic-free', 'cruelty-free', 'non-toxic', 'gluten-free'
  ];

  for (let i = 0; i < valueFlags.length; i++) {
    if (product[valueFlags[i]] === true || product[valueFlags[i]] === '1' || product[valueFlags[i]] === 1) {
      values.push(valueLabels[i]);
    }
  }

  return values;
}
