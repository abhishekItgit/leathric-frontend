const getCategoryName = (category) => {
  if (typeof category === 'string') return category;
  if (category && typeof category === 'object') {
    return category.name || category.title || 'Uncategorized';
  }
  return 'Uncategorized';
};

const normalizeImageValue = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return value.url || value.imageUrl || value.src || '';
  }
  return '';
};

const extractGallery = (product) => {
  const gallerySources = [
    product?.galleryImages,
    product?.images,
    product?.imageUrls,
    product?.media,
  ];

  const images = gallerySources
    .flatMap((source) => (Array.isArray(source) ? source : []))
    .map(normalizeImageValue)
    .filter(Boolean);

  return Array.from(new Set(images));
};

export const mapProduct = (product) => {
  const galleryImages = extractGallery(product);
  const primaryImage =
    normalizeImageValue(product?.imageUrl) ||
    normalizeImageValue(product?.image) ||
    normalizeImageValue(product?.thumbnail) ||
    normalizeImageValue(galleryImages[0]) ||
    '';

  return {
    ...product,
    category: getCategoryName(product?.category),
    categoryName:
      product?.categoryName ||
      (typeof product?.category === 'string'
        ? product.category
        : product?.category?.name || product?.category?.title || ''),
    imageUrl: primaryImage,
    galleryImages,
  };
};

export const mapProducts = (products = []) => products.map(mapProduct);

export const normalizeProductResponse = (response) => {
  if (Array.isArray(response)) return mapProducts(response);
  if (Array.isArray(response?.products)) return mapProducts(response.products);
  if (Array.isArray(response?.content)) return mapProducts(response.content);
  if (Array.isArray(response?.data?.content)) return mapProducts(response.data.content);
  if (Array.isArray(response?.data)) return mapProducts(response.data);
  return [];
};

export const normalizeSingleProductResponse = (response) => {
  const product = response?.product || response?.data || response;
  if (!product || typeof product !== 'object') return null;
  return mapProduct(product);
};

export const normalizeCategoryResponse = (response) => {
  const categories =
    response?.categories || response?.content || response?.data || response || [];
  if (!Array.isArray(categories)) return [];

  return categories
    .map((category) =>
      typeof category === 'string' ? category : category?.name || category?.title
    )
    .filter(Boolean);
};
