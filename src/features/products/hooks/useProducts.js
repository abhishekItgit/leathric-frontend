import { useCallback, useEffect, useMemo, useState } from 'react';
import { productApi } from '../api/productApi';
import { axiosClient } from '../../../lib/axiosClient';

export function useProducts(params) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const queryParams = useMemo(() => params || {}, [params]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [response, categoryData] = await Promise.all([
        axiosClient.get('/products', { params: queryParams }),
        productApi.getCategories(),
      ]);

      console.log('API RESPONSE:', response.data);
      const products = response?.data?.data?.content || [];
      console.log('PRODUCT ARRAY:', products);

      const normalizedProducts = Array.isArray(products)
        ? products.map((product) => ({
            ...product,
            categoryName:
              product?.categoryName ||
              (typeof product?.category === 'string'
                ? product.category
                : product?.category?.name || product?.category?.title || ''),
          }))
        : [];

      // Extract categories array from response
      let categoriesArray = [];
      if (Array.isArray(categoryData)) {
        categoriesArray = categoryData;
      } else if (categoryData?.data && Array.isArray(categoryData.data)) {
        categoriesArray = categoryData.data;
      } else if (categoryData?.categories && Array.isArray(categoryData.categories)) {
        categoriesArray = categoryData.categories;
      } else if (categoryData?.content && Array.isArray(categoryData.content)) {
        categoriesArray = categoryData.content;
      }

      setProducts(normalizedProducts);
      setCategories(categoriesArray);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load products right now.');
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    categories,
    loading,
    error,
    refetch: fetchProducts,
  };
}

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProduct = useCallback(async () => {
    if (!id) {
      setProduct(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await productApi.getProductById(id);
      setProduct(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load product details.');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
}
