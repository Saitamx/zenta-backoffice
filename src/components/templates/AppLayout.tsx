import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../atoms/Button";
import { BookOpen, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { LanguageToggle } from "../atoms/LanguageToggle";
import { useTranslation } from "react-i18next";

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/books" className="flex items-center gap-2">
            <BookOpen className="text-indigo-600" />
            <span className="text-base font-semibold text-gray-900">{t("app.title")}</span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <span className="hidden text-sm text-gray-700 md:inline">{user?.name}</span>
            <Button variant="ghost" onClick={logout} className="gap-2">
              <LogOut size={18} /> {t("nav.logout")}
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
};


