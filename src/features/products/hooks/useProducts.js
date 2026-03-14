import { useCallback, useEffect, useMemo, useState } from 'react';
import { productApi } from '../api/productApi';
import {
  normalizeCategoryResponse,
  normalizeProductResponse,
  normalizeSingleProductResponse,
} from '../../../utils/productMappers';

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
      const [productsResponse, categoryResponse] = await Promise.all([
        productApi.getProducts(queryParams),
        productApi.getCategories(),
      ]);

      setProducts(normalizeProductResponse(productsResponse));
      setCategories(normalizeCategoryResponse(categoryResponse));
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
      const response = await productApi.getProductById(id);
      setProduct(normalizeSingleProductResponse(response));
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
