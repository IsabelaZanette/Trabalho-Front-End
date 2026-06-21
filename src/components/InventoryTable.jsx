import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Edit2 } from 'lucide-react';

// InventoryTable é um componente de exibição que renderiza a grade de produtos.
// Ele lida com busca, filtragem e usa navegação do React Router para ajustar o estoque.
function InventoryTable({ products }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');

  const categories = ['todos', ...new Set(products.map((p) => p.categoria))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descricao.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'todos' || product.categoria === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const formatPrice = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) {
      return { label: 'Esgotado', className: 'stock-badge critical' };
    }
    if (quantity >= 1 && quantity <= 3) {
      return { label: 'Estoque Baixo', className: 'stock-badge warning' };
    }
    return { label: 'Em Estoque', className: 'stock-badge healthy' };
  };

  return (
    <div className="table-wrapper">
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
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

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
              filteredProducts.map((product) => {
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
                      <span
                        className={`stock-number ${
                          product.estoque === 0
                            ? 'text-critical'
                            : product.estoque <= 3
                            ? 'text-warning'
                            : 'text-healthy'
                        }`}
                      >
                        {product.estoque} u.
                      </span>
                    </td>
                    <td>
                      <span className={stockStatus.className}>{stockStatus.label}</span>
                    </td>
                    <td>
                      {/* Clicar neste botão leva você ao caminho de ajuste de estoque para este produto. */}
                      <button className="action-btn" onClick={() => navigate(`/adjust/${product.id}`)}>
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
