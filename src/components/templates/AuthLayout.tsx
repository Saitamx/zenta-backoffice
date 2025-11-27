import React from "react";
import { BookMarked } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "../atoms/LanguageToggle";

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen">
      <video
        className="pointer-events-none fixed inset-0 h-full w-full object-cover"
        src="/video_login.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 backdrop-blur-[1px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="absolute right-4 top-4">
          <LanguageToggle />
        </div>
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute -left-10 -top-8 h-40 w-40 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-fuchsia-500/30 blur-3xl" />
          <div className="rounded-2xl bg-gradient-to-br from-white/30 to-indigo-200/40 p-[1px] shadow-2xl backdrop-blur">
            <div className="rounded-2xl bg-white/95 p-6 ring-1 ring-gray-200/80 [background:radial-gradient(1200px_600px_at_-10%_-20%,rgba(99,102,241,0.04),transparent),radial-gradient(800px_400px_at_120%_120%,rgba(236,72,153,0.04),transparent)]">
              <div className="mb-6 flex items-center justify-center gap-2 text-gray-900">
                <div className="rounded-xl bg-indigo-50 p-2 ring-1 ring-indigo-100">
                  <BookMarked className="text-indigo-600 drop-shadow" size={24} />
                </div>
                <h1 className="text-xl font-semibold tracking-wide">{t("app.title")}</h1>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


