import React, { useCallback, useState } from "react";
import { AuthLayout } from "../components/templates/AuthLayout";
import { Input } from "../components/atoms/Input";
import { Button } from "../components/atoms/Button";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Alert } from "../components/atoms/Alert";
import { LogIn, Mail, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

const DEFAULT_EMAIL = "";

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<string | undefined>(undefined);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorKey(undefined);
      setLoading(true);
      try {
        await login({ email, password }, { remember: rememberMe });
        navigate("/books", { replace: true });
      } catch (err) {
        const raw = (err as Error).message || "";
        const key =
          raw === "AUTH_INVALID"
            ? "auth.login.errorInvalid"
            : raw === "AUTH_GENERIC"
            ? "auth.login.errorGeneric"
            : /invalid|credenciales|unauthorized/i.test(raw)
            ? "auth.login.errorInvalid"
            : "auth.login.errorGeneric";
        setErrorKey(key);
      } finally {
        setLoading(false);
      }
    },
    [email, password, rememberMe, login, navigate]
  );

  return (
    <AuthLayout>
      <form onSubmit={onSubmit} className="space-y-4" autoComplete="off">
        <h2 className="text-xl font-semibold text-gray-900">{t("auth.login.title")}</h2>
        <p className="text-sm text-gray-700">{t("auth.login.subtitle")}</p>
        <div className="space-y-1">
          <label className="mb-1 block text-sm font-medium text-gray-800">{t("auth.login.emailLabel")}</label>
          <div className="relative">
            <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("auth.login.emailPlaceholder")}
            required
            autoComplete="off"
            inputMode="email"
            onInvalid={(e) => e.currentTarget.setCustomValidity(t("auth.login.requiredEmail"))}
            onInput={(e) => e.currentTarget.setCustomValidity("")}
            className="pl-10 py-3 text-base"
          />
          </div>
        </div>
        <div className="space-y-1">
          <label className="mb-1 block text-sm font-medium text-gray-800">{t("auth.login.passwordLabel")}</label>
          <div className="relative">
            <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("auth.login.passwordPlaceholder")}
            required
            autoComplete="off"
            onInvalid={(e) => e.currentTarget.setCustomValidity(t("auth.login.requiredPassword"))}
            onInput={(e) => e.currentTarget.setCustomValidity("")}
            className="pl-10 py-3 text-base"
          />
          </div>
        </div>
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            {t("auth.login.rememberMe")}
          </label>
        </div>
        {errorKey && <Alert tone="error">{t(errorKey)}</Alert>}

        <Button
          type="submit"
          className="w-full gap-2 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white hover:from-indigo-500 hover:to-fuchsia-500 focus:ring-indigo-500"
          disabled={loading}
        >
          <LogIn size={18} />
          {loading ? `${t("auth.login.submit")}...` : t("auth.login.submit")}
        </Button>
        </form>
    </AuthLayout>
  );
};


