import DashboardStats from '../components/DashboardStats';
import InventoryTable from '../components/InventoryTable';
import { RotateCw } from 'lucide-react';

// InventoryPage é um componente de página que mostra o dashboard e a tabela de inventário.
// Ele é renderizado pela rota '/' no App.
function InventoryPage({ products, loading, error, onRefresh }) {
  return (
    <div className="page-content">
      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <RotateCw className="spinner" size={40} />
          <p>Carregando produtos...</p>
        </div>
      ) : (
        <>
          <DashboardStats products={products} />
          {/* InventoryTable is a reusable component for rendering the inventory list. */}
          <InventoryTable products={products} />
        </>
      )}
    </div>
  );
}

export default InventoryPage;
