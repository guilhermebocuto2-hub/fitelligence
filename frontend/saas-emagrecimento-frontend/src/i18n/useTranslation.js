import { useLanguage } from "./LanguageContext";

export function useTranslation() {
  const { translations } = useLanguage();

  const t = (path) => {
    const keys = path.split(".");
    let value = translations;

    for (const key of keys) {
      value = value?.[key];
    }

    return value || path;
  };

  return { t };
}