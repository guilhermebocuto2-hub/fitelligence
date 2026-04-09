"use client";

// ======================================================
// Providers globais da aplicação
// Responsável por centralizar:
// - autenticação
// - idioma
// - toasts
// - tema
// ======================================================

import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "../context/ToastContext";
import { ThemeProvider } from "../context/ThemeContext";
import { LanguageProvider } from "../i18n/LanguageContext";
import ToastViewport from "../components/ui/ToastViewport";

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            {children}
            <ToastViewport />
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}