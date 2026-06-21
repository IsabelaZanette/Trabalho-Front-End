import React, { useState } from 'react';
import { Search, SlidersHorizontal, Edit2, TrendingDown } from 'lucide-react';

function InventoryTable({ products, onSelectProduct }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');

  // Obter categorias únicas a partir dos produtos
  const categories = ['todos', ...new Set(products.map(p => p.categoria))];

  // Filtrar produtos com base na busca e na categoria selecionada
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'todos' || 
      product.categoria === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Função para formatar preço para Real brasileiro (BRL)
  const formatPrice = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Função para definir o badge de estoque e a cor de alerta
  const getStockStatus = (quantity) => {
    if (quantity === 0) {
      return { label: 'Crítico / Esgotado', className: 'stock-badge critical' };
    } else if (quantity >= 1 && quantity <= 3) {
      return { label: 'Estoque Baixo', className: 'stock-badge warning' };
    } else {
      return { label: 'Em Estoque', className: 'stock-badge healthy' };
    }
  };

  return (
    <div className="table-wrapper">
      {/* Controles de Filtros e Busca */}
      <div className="table-controls">
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Pesquisar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <SlidersHorizontal className="filter-icon" size={18} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Estoque Físico</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => {
                const stockStatus = getStockStatus(product.estoque);
                return (
                  <tr key={product.id} className={product.estoque === 0 ? 'row-critical' : ''}>
                    <td>
                      <div className="product-info">
                        <span className="product-name">
                          {product.nome}
                          {product.promocao && <span className="promo-tag">Promo</span>}
                        </span>
                        <span className="product-desc">{product.descricao}</span>
                      </div>
                    </td>
                    <td>
                      <span className="category-tag">{product.categoria}</span>
                    </td>
                    <td className="price-col">{formatPrice(product.preco)}</td>
                    <td className="stock-col">
                      <span className={`stock-number ${product.estoque === 0 ? 'text-critical' : product.estoque <= 3 ? 'text-warning' : 'text-healthy'}`}>
                        {product.estoque} u.
                      </span>
                    </td>
                    <td>
                      <span className={stockStatus.className}>{stockStatus.label}</span>
                    </td>
                    <td>
                      <button 
                        className="action-btn"
                        onClick={() => onSelectProduct(product)}
                      >
                        <Edit2 size={14} />
                        Ajustar Estoque
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="empty-row">
                  Nenhum produto encontrado com os filtros selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryTable;
