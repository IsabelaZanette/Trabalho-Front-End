import { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://localhost:3001/produtos';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const fetchProducts = useCallback(async (forceLoading = false) => {
    if (forceLoading) {
      setLoading(true);
    }
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Falha ao conectar com o banco de dados.');
      }
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar os dados. Certifique-se de que o servidor está rodando (npm run server).');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSaveStock = useCallback(async (id, newQuantity) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estoque: newQuantity }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar no banco de dados.');
      }

      // Re-carregar lista
      await fetchProducts();

      // Encontrar produto para toast
      const updatedProduct = products.find(p => p.id === id);
      showToast(`Estoque do item "${updatedProduct ? updatedProduct.nome : 'desconhecido'}" atualizado para ${newQuantity} unidades!`);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, [fetchProducts, products, showToast]);

  return {
    products,
    loading,
    error,
    toast,
    fetchProducts,
    handleSaveStock,
    showToast
  };
}
