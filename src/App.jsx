import { RotateCw } from 'lucide-react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useProducts } from './hooks/useProducts';
import { useToast } from './hooks/useToast';
import InventoryPage from './pages/InventoryPage';
import AdjustStockPage from './pages/AdjustStockPage';
import logo from './assets/falcao.png';
import './App.css';

// App é o ponto de entrada principal do aplicativo.
// Ele compõe hooks personalizados e roteamento para renderizar o fluxo de gerenciamento de estoque.
function App() {
  const { products, loading, error, fetchProducts, updateProductStock } = useProducts();
  const { toast, showToast } = useToast();

  const handleSaveStock = async (id, newQuantity) => {
    await updateProductStock(id, newQuantity);
    const updatedProduct = products.find((p) => String(p.id) === String(id));
    showToast(
      updatedProduct
        ? `Estoque do item "${updatedProduct.nome}" atualizado para ${newQuantity} unidades!`
        : `Estoque atualizado para ${newQuantity} unidades.`
    );
  };

  return (
    <div className="app-layout">
      {toast && (
        <div className="toast-notification">
          <span>{toast}</span>
        </div>
      )}

      <header className="erp-header">
        <div className="header-logo-area">
          <div>
            <img src={logo} alt="Logo Falkon" className="logo-badge" />
          </div>
          <div>
            <h1>Falkon</h1>
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
              element={<AdjustStockPage products={products} onSaveStock={handleSaveStock} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>

      <footer className="erp-footer">
        <p>&copy; {new Date().getFullYear()} Falkon Almoxarifado B2B. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
