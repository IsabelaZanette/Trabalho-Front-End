import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RotateCw } from 'lucide-react';
import { useProducts } from './hooks/useProducts';
import { useToast } from './hooks/useToast';
import InventoryPage from './pages/InventoryPage';
import AdjustStockPage from './pages/AdjustStockPage';
import './App.css';

function App() {
  const { products, loading, error, fetchProducts, updateProductStock } = useProducts();
  const { toast, showToast } = useToast();

  const handleSaveStock = async (id, newQuantity) => {
    try {
      await updateProductStock(id, newQuantity);
      const updatedProduct = products.find(p => p.id === id);
      showToast(`Estoque do item "${updatedProduct?.nome}" atualizado para ${newQuantity} unidades!`);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <BrowserRouter>
      <AppContent
        products={products}
        loading={loading}
        error={error}
        toast={toast}
        fetchProducts={fetchProducts}
        handleSaveStock={handleSaveStock}
      />
    </BrowserRouter>
  );
}

function AppContent({ products, loading, error, toast, fetchProducts, handleSaveStock }) {

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

        <button 
          className="refresh-btn" 
          onClick={() => fetchProducts(true)} 
          disabled={loading} 
          title="Recarregar Dados"
        >
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
            <button className="btn btn-primary" onClick={() => fetchProducts(true)}>
              Tentar Novamente
            </button>
          </div>
        ) : (
          <Routes>
            <Route 
              path="/" 
              element={
                <InventoryPage
                  products={products}
                  loading={loading}
                  error={error}
                  onRefresh={() => fetchProducts(true)}
                />
              }
            />
            <Route
              path="/adjust/:id"
              element={
                <AdjustStockPage
                  products={products}
                  onSaveStock={handleSaveStock}
                />
              }
            />
          </Routes>
        )}
      </main>

      <footer className="erp-footer">
        <p>&copy; {new Date().getFullYear()} Falkon Almoxarifado B2B. Todos os direitos reservados. </p>
      </footer>
    </div>
  );
}

export default App;
