import { RotateCw } from 'lucide-react';
import { Routes, Route } from 'react-router-dom';
import { useProducts } from './hooks/useProducts';
import { useToast } from './hooks/useToast';
import InventoryPage from './pages/InventoryPage';
import AdjustStockPage from './pages/AdjustStockPage';
import './App.css';

// App é o ponto de entrada principal do aplicativo.
// Ele compõe hooks personalizados e roteamento para renderizar o fluxo de gerenciamento de estoque.
function App() {
  // Hooks personalizados fornecem lógica de negócio reutilizável.
  const { products, loading, error, fetchProducts, updateProductStock } = useProducts();
  const { toast, showToast } = useToast();

  const handleSaveStock = async (id, newQuantity) => {
    // Delegar a atualização de estoque ao hook personalizado e depois mostrar um toast.
    await updateProductStock(id, newQuantity);
    const updatedProduct = products.find((p) => String(p.id) === String(id));
    showToast(`Estoque do item "${updatedProduct?.nome}" atualizado para ${newQuantity} unidades!`);
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
          <div className="logo-badge">F</div>
          <div>
            <h1>Falkon B2B</h1>
            <p>Painel Operacional de Almoxarifado</p>
          </div>
        </div>

        <button className="refresh-btn" onClick={() => fetchProducts(true)} disabled={loading} title="Recarregar Dados">
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
          // Routes define os caminhos de navegação da aplicação e renderizam a página apropriada.
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
                <AdjustStockPage products={products} onSaveStock={handleSaveStock} />
              }
            />
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
