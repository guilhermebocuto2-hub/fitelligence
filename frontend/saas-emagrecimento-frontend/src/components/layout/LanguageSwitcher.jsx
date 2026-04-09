"use client";

// ======================================================
// Seletor de idioma premium do Fitelligence
// Responsável por:
// - exibir o idioma atual
// - permitir troca entre PT, EN e ES
// - atualizar o idioma global em tempo real
// - fechar ao clicar fora
// ======================================================

import { useEffect, useRef, useState } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";
import { useTranslation } from "../../i18n/useTranslation";

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const languageOptions = [
    {
      code: "pt",
      label: t("language.portuguese"),
      shortLabel: "PT",
    },
    {
      code: "en",
      label: t("language.english"),
      shortLabel: "EN",
    },
    {
      code: "es",
      label: t("language.spanish"),
      shortLabel: "ES",
    },
  ];

  const currentLanguage =
    languageOptions.find((item) => item.code === language) || languageOptions[0];

  const handleSelectLanguage = (code) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 hover:shadow-md"
      >
        <Globe className="h-4 w-4" />
        <span>{currentLanguage.shortLabel}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-56 overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-2 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <div className="px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              {t("language.select")}
            </p>
          </div>

          <div className="space-y-1">
            {languageOptions.map((item) => {
              const isActive = item.code === language;

              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSelectLanguage(item.code)}
                  className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left transition-all duration-300 ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {item.shortLabel}
                    </p>
                  </div>

                  {isActive ? <Check className="h-4 w-4" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}