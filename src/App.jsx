import React, { useState, useEffect } from 'react';
import DashboardStats from './components/DashboardStats';
import InventoryTable from './components/InventoryTable';
import AdjustStockForm from './components/AdjustStockForm';
import { PackageOpen, RotateCw } from 'lucide-react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Navegação: 'list' | 'adjust'
  const [view, setView] = useState('list');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);

  // URL base da API do json-server
  const API_URL = 'http://localhost:3001/produtos';

  const fetchProducts = async () => {
    setLoading(true);
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
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setView('adjust');
  };

  const handleSaveStock = async (id, newQuantity) => {
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
      
      // Mostrar mensagem de sucesso (toast)
      const updatedProduct = products.find(p => p.id === id);
      showToast(`Estoque do item "${updatedProduct?.nome}" atualizado para ${newQuantity} unidades!`);
      
      // Voltar para listagem
      setView('list');
      setSelectedProduct(null);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  return (
    <div className="app-layout">
      {/* Toast Notification */}
      {toast && (
        <div className="toast-notification">
          <span>{toast}</span>
        </div>
      )}

      {/* Header do ERP */}
      <header className="erp-header">
        <div className="header-logo-area">
          <div className="logo-badge">F</div>
          <div>
            <h1>Falkon B2B</h1>
            <p>Painel Operacional de Almoxarifado</p>
          </div>
        </div>

        <button className="refresh-btn" onClick={fetchProducts} disabled={loading} title="Recarregar Dados">
          <RotateCw className={loading ? 'spin-animation' : ''} size={18} />
          {loading ? 'Sincronizando...' : 'Sincronizar'}
        </button>
      </header>

      {/* Conteúdo Principal */}
      <main className="erp-main">
        {loading && products.length === 0 ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Carregando dados do almoxarifado...</p>
          </div>
        ) : error ? (
          <div className="error-card">
            <h3>⚠️ Servidor Offline</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchProducts}>
              Tentar Novamente
            </button>
          </div>
        ) : (
          <>
            {view === 'list' ? (
              <div className="fade-in">
                {/* Big Numbers */}
                <DashboardStats products={products} />
                
                {/* Tabela de Estoque */}
                <div className="card-panel">
                  <div className="panel-header">
                    <h2>Estoque Geral</h2>
                    <span className="panel-subtitle">Lista de insumos e produtos para expedição</span>
                  </div>
                  <InventoryTable 
                    products={products} 
                    onSelectProduct={handleSelectProduct} 
                  />
                </div>
              </div>
            ) : (
              <div className="fade-in">
                {/* Formulário de Ajuste */}
                <AdjustStockForm 
                  product={selectedProduct} 
                  onSave={handleSaveStock} 
                  onCancel={() => {
                    setView('list');
                    setSelectedProduct(null);
                  }} 
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Rodapé */}
      <footer className="erp-footer">
        <p>&copy; {new Date().getFullYear()} Falkon Almoxarifado B2B. Todos os direitos reservados. Projeto Front-End.</p>
      </footer>
    </div>
  );
}

export default App;
