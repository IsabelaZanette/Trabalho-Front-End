import { useParams, useNavigate } from 'react-router-dom';
import { RotateCw } from 'lucide-react';
import AdjustStockForm from '../components/AdjustStockForm';

// AdjustStockPage é renderizado quando a aplicação navega para /adjust/:id.
// Ele obtém o produto selecionado via parâmetro de rota e exibe o formulário.
function AdjustStockPage({ products, onSaveStock }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => String(p.id) === String(id));

  if (products.length === 0) {
    // Se a lista de produtos ainda não estiver carregada, exibe um carregador até a API retornar dados.
    return (
      <div className="page-content">
        <div className="loader-container">
          <RotateCw className="spinner" size={40} />
          <p>Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-content">
        <div className="error-banner">
          <p>Produto não encontrado.</p>
        </div>
        <button className="back-link-btn" onClick={() => navigate('/')}>Voltar para Listagem</button>
      </div>
    );
  }

  return (
    <div className="page-content">
      <AdjustStockForm
        product={product}
        onSave={async (productId, newQuantity) => {
          await onSaveStock(productId, newQuantity);
          navigate('/');
        }}
        onCancel={() => navigate('/')}
      />
    </div>
  );
}

export default AdjustStockPage;
