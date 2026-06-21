import { Package, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

function DashboardStats({ products }) {
  const totalProducts = products.length;
  const outOfStock = products.filter(p => p.estoque === 0).length;
  const lowStock = products.filter(p => p.estoque >= 1 && p.estoque <= 3).length;
  const healthyStock = products.filter(p => p.estoque >= 4).length;

  return (
    <div className="stats-container">
      <div className="stat-card total">
        <div className="stat-header">
          <Package className="stat-icon" size={24} />
          <span className="stat-title">Total de Produtos</span>
        </div>
        <div className="stat-value">{totalProducts}</div>
      </div>

      <div className="stat-card critical">
        <div className="stat-header">
          <XCircle className="stat-icon" size={24} />
          <span className="stat-title">Sem Estoque</span>
        </div>
        <div className="stat-value">{outOfStock}</div>
      </div>

      <div className="stat-card warning">
        <div className="stat-header">
          <AlertTriangle className="stat-icon" size={24} />
          <span className="stat-title">Estoque Baixo</span>
        </div>
        <div className="stat-value">{lowStock}</div>
      </div>

      <div className="stat-card healthy">
        <div className="stat-header">
          <CheckCircle className="stat-icon" size={24} />
          <span className="stat-title">Estoque Saudável</span>
        </div>
        <div className="stat-value">{healthyStock}</div>
      </div>
    </div>
  );
}

export default DashboardStats;
