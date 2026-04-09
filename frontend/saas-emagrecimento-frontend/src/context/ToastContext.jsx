"use client";

// ======================================================
// Contexto global de toast
// Responsável por:
// - armazenar notificações temporárias
// - permitir exibir feedback visual em qualquer tela
// - remover toasts automaticamente após alguns segundos
// ======================================================

import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // ====================================================
  // Função principal para criar um novo toast
  // ====================================================
  const showToast = useCallback(
    ({ title, description = "", type = "success", duration = 3500 }) => {
      const id = ++toastIdCounter;

      const newToast = {
        id,
        title,
        description,
        type,
      };

      setToasts((prev) => [...prev, newToast]);

      // ==================================================
      // Remove o toast automaticamente após o tempo definido
      // ==================================================
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    },
    []
  );

  // ====================================================
  // Remove um toast manualmente
  // ====================================================
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}