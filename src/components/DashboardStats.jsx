import React from 'react';
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
          <span className="stat-title">Total de Produtos</span>
          <Package className="stat-icon" size={24} />
        </div>
        <div className="stat-value">{totalProducts}</div>
        <p className="stat-desc">Cadastrados no sistema</p>
      </div>

      <div className="stat-card critical">
        <div className="stat-header">
          <span className="stat-title">Sem Estoque</span>
          <XCircle className="stat-icon" size={24} />
        </div>
        <div className="stat-value">{outOfStock}</div>
        <p className="stat-desc">Ação necessária imediata</p>
      </div>

      <div className="stat-card warning">
        <div className="stat-header">
          <span className="stat-title">Estoque Baixo</span>
          <AlertTriangle className="stat-icon" size={24} />
        </div>
        <div className="stat-value">{lowStock}</div>
        <p className="stat-desc">Entre 1 e 3 unidades</p>
      </div>

      <div className="stat-card healthy">
        <div className="stat-header">
          <span className="stat-title">Estoque Saudável</span>
          <CheckCircle className="stat-icon" size={24} />
        </div>
        <div className="stat-value">{healthyStock}</div>
        <p className="stat-desc">Acima de 3 unidades</p>
      </div>
    </div>
  );
}

export default DashboardStats;
