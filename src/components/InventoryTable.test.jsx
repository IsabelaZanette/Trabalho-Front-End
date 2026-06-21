import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import InventoryTable from './InventoryTable';

const products = [
  { id: '1', nome: 'Teclado', descricao: 'desc', categoria: 'perifericos', preco: 100, estoque: 5 },
];

describe('InventoryTable', () => {
  it('renders product rows', () => {
    render(
      <MemoryRouter>
        <InventoryTable products={products} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Teclado/)).toBeInTheDocument();
    expect(screen.getByText(/perifericos/)).toBeInTheDocument();
  });
});
