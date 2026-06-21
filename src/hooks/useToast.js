import { useState, useCallback } from 'react';

// useToast é um hook customizado reutilizável para notificações toast.
// Ele mantém o texto do toast no estado e fornece uma função para mostrar a mensagem por um tempo.
export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, duration = 4000) => {
    setToast(message);
    window.setTimeout(() => {
      setToast(null);
    }, duration);
  }, []);

  return {
    toast,
    showToast,
  };
}
