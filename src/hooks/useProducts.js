import { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://localhost:3001/produtos';

// useProducts é um hook customizado que encapsula a lógica de carregamento e atualização de produtos.
// Ele mantém o estado dentro do hook e expõe funções para buscar e atualizar o estoque.
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetchProducts carrega a lista atual de produtos da API.
  // forceLoading pode exibir o carregamento mesmo após a primeira carga.
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

  // updateProductStock grava a nova quantidade de estoque na API,
  // e em seguida atualiza a lista de produtos para manter a interface sincronizada.
  const updateProductStock = useCallback(async (id, newQuantity) => {
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

    await fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    updateProductStock,
  };
}
