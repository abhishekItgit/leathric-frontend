import { useCallback, useEffect, useMemo, useState } from 'react';
import { productService } from '../services/productService';

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
      const [productData, categoryData] = await Promise.all([
        productService.getProducts(queryParams),
        productService.getCategories(),
      ]);

      setProducts(productData);
      setCategories(categoryData);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load products right now.');
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
      const data = await productService.getProductById(id);
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
