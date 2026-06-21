import { renderHook, act } from '@testing-library/react';
import { useToast } from './useToast';
import { vi } from 'vitest';

describe('useToast', () => {
  it('shows and hides toast after duration', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Hello', 2000);
    });

    expect(result.current.toast).toBe('Hello');

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.toast).toBe(null);
    vi.useRealTimers();
  });
});
