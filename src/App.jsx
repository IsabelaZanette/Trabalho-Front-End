import { Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import { useProducts } from './hooks/useProducts';
import DashboardStats from './components/DashboardStats';
import InventoryTable from './components/InventoryTable';
import AdjustStockForm from './components/AdjustStockForm';
import { RotateCw } from 'lucide-react';
import logo from './assets/falcao.png';
import './App.css';

// Componente Wrapper para a Rota de Ajuste de Estoque
function AdjustStockPage({ products, onSave }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => String(p.id) === String(id));

  if (!product) {
    return (
      <div className="error-card">
        <h3>⚠️ Produto não encontrado</h3>
        <p>O produto solicitado não foi localizado no inventário.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Voltar para Home
        </button>
      </div>
    );
  }

  return (
    <AdjustStockForm
      product={product}
      onSave={async (prodId, newQty) => {
        await onSave(prodId, newQty);
        navigate('/');
      }}
      onCancel={() => navigate('/')}
    />
  );
}

function App() {
  const navigate = useNavigate();
  const {
    products,
    loading,
    error,
    toast,
    fetchProducts,
    handleSaveStock
  } = useProducts();

  const handleSelectProduct = (product) => {
    navigate(`/ajustar/${product.id}`);
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
          <div > <img src={logo} alt="Logo Falkon" className="logo-badge" /> </div>
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
            {/* Rota 1: Lista e Dashboard */}
            <Route path="/" element={
              <div className="fade-in">
                {/* Big Numbers */}
                <DashboardStats products={products} />

                {/* Tabela de Estoque */}
                <div className="card-panel">
                  <div className="panel-header">
                    <h2>Estoque Geral</h2>
                  </div>
                  <InventoryTable
                    products={products}
                    onSelectProduct={handleSelectProduct}
                  />
                </div>
              </div>
            } />

            {/* Rota 2: Formulário de Ajuste */}
            <Route path="/ajustar/:id" element={
              <div className="fade-in">
                <AdjustStockPage products={products} onSave={handleSaveStock} />
              </div>
            } />

            {/* Redirecionar qualquer outra rota para Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>

      <footer className="erp-footer">
        <p>&copy; {new Date().getFullYear()} Falkon. Todos os direitos reservados. </p>
      </footer>
    </div>
  );
}

export default App;
