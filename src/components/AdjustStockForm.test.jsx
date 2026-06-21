import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import AdjustStockForm from './AdjustStockForm';

const product = { id: '1', nome: 'Teclado', descricao: 'desc', preco: 100, estoque: 5 };

describe('AdjustStockForm', () => {
  it('increments, decrements and submits', async () => {
    const onSave = vi.fn(() => Promise.resolve());
    const onCancel = vi.fn();

    render(<AdjustStockForm product={product} onSave={onSave} onCancel={onCancel} />);

    // increment using aria-label
    const inc = screen.getByLabelText(/Incrementar/);
    await userEvent.click(inc);

    // submit
    const saveBtn = screen.getByText(/Salvar Alterações/);
    await userEvent.click(saveBtn);

    // onSave called
    expect(onSave).toHaveBeenCalled();
  });
});
