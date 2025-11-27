import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";
import { Globe } from "lucide-react";

export const LanguageToggle: React.FC = () => {
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage || i18n.language || "es";
  const next = current.startsWith("es") ? "en" : "es";
  const label = current.startsWith("es") ? "ES" : "EN";

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => i18n.changeLanguage(next)}
      className="gap-2 text-white hover:bg-white/20 focus:ring-white/50"
      aria-label={t("nav.language")}
      title={t("nav.language")}
    >
      <Globe size={18} />
      {label}
    </Button>
  );
};


