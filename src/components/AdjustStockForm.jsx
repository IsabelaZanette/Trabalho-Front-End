import { useState } from 'react';
import { Save, X, Plus, Minus, ArrowLeft, Archive } from 'lucide-react';

// AdjustStockForm é um componente de formulário reutilizável para atualizar o estoque de um produto.
function AdjustStockForm({ product, onSave, onCancel }) {
  const [stockVal, setStockVal] = useState(product.estoque);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleIncrement = () => {
    setStockVal(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (stockVal > 0) {
      setStockVal(prev => prev - 1);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setStockVal(value);
    } else if (e.target.value === '') {
      setStockVal(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(product.id, stockVal);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar no banco de dados.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="adjust-card">
      <div className="adjust-header">
        <button className="back-link-btn" onClick={onCancel}>
          <ArrowLeft size={16} />
          Voltar para Listagem
        </button>
        <h2 className="adjust-title">
          <Archive size={20} className="adjust-title-icon" />
          Ajustar Estoque
        </h2>
      </div>

      <div className="product-summary-card">
        <div className="prod-meta">
          <span className="prod-category">{product.categoria}</span>
          <h3 className="prod-name">{product.nome}</h3>
          <p className="prod-desc">{product.descricao}</p>
        </div>
        <div className="prod-price-badge">
          <span>Preço Unitário</span>
          <strong>{formatPrice(product.preco)}</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="adjust-form">
        <div className="counter-section">
          <label className="counter-label">Quantidade em Estoque Físico</label>
          <p className="counter-help">Clique nos botões de ajuste rápido ou digite um novo valor.</p>

          <div className="counter-control-wrapper">
            <button
              type="button"
              className="counter-btn dec-btn"
              onClick={handleDecrement}
              disabled={stockVal === 0}
              aria-label="Decrementar"
            >
              <Minus size={24} />
            </button>

            <input
              type="number"
              min="0"
              className="counter-input"
              value={stockVal}
              onChange={handleInputChange}
            />

            <button
              type="button"
              className="counter-btn inc-btn"
              onClick={handleIncrement}
              aria-label="Incrementar"
            >
              <Plus size={24} />
            </button>
          </div>

          <div className="status-preview-wrapper">
            <span>Status após salvar: </span>
            {stockVal === 0 ? (
              <span className="stock-badge critical text-center">Esgotado</span>
            ) : stockVal <= 3 ? (
              <span className="stock-badge warning text-center">Estoque Baixo</span>
            ) : (
              <span className="stock-badge healthy text-center">Em Estoque</span>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X size={16} />
            Cancelar
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            <Save size={16} />
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdjustStockForm;
