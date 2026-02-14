const getCategoryName = (category) => {
  if (typeof category === 'string') return category;
  if (category && typeof category === 'object') {
    return category.name || category.title || 'Uncategorized';
  }
  return 'Uncategorized';
};

export const mapProduct = (product) => ({
  ...product,
  category: getCategoryName(product.category),
  imageUrl: product.imageUrl || product.image || '',
});

export const mapProducts = (products = []) => products.map(mapProduct);

export const normalizeProductResponse = (response) => {
  if (Array.isArray(response)) return mapProducts(response);
  if (Array.isArray(response?.products)) return mapProducts(response.products);
  if (Array.isArray(response?.content)) return mapProducts(response.content);
  return [];
};

export const normalizeSingleProductResponse = (response) => {
  const product = response?.product || response;
  if (!product) return null;
  return mapProduct(product);
};

export const normalizeCategoryResponse = (response) => {
  const categories = response?.categories || response?.content || response || [];
  if (!Array.isArray(categories)) return [];

  return categories
    .map((category) => (typeof category === 'string' ? category : category?.name || category?.title))
    .filter(Boolean);
};
