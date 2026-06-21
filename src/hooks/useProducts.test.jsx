import { renderHook, waitFor } from '@testing-library/react';
import { useProducts } from './useProducts';
import { vi } from 'vitest';

const mockProducts = [{ id: '1', nome: 'P1' }, { id: '2', nome: 'P2' }];

describe('useProducts', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockProducts) })));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches products on mount', async () => {
    const { result } = renderHook(() => useProducts());

    await waitFor(() => expect(result.current.products.length).toBe(2));
    expect(result.current.products[0].nome).toBe('P1');
  });
});
