"use client";

// ======================================================
// Contexto global de idioma
// Responsável por:
// - controlar idioma ativo
// - salvar idioma no localStorage
// - disponibilizar traduções para toda a aplicação
// ======================================================

import { createContext, useContext, useState } from "react";
import pt from "./translations/pt";
import en from "./translations/en";
import es from "./translations/es";

const LanguageContext = createContext();

const languages = {
  pt,
  en,
  es,
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Inicializacao lazy evita setState dentro de effect.
    if (typeof window === "undefined") return "pt";

    const savedLanguage = window.localStorage.getItem("lang");
    return savedLanguage && languages[savedLanguage] ? savedLanguage : "pt";
  });

  const changeLanguage = (lang) => {
    if (!languages[lang]) return;

    setLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        translations: languages[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
