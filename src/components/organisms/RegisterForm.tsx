import React, { useCallback, useState } from "react";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";
import { Alert } from "../atoms/Alert";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { UserPlus, User, Mail, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  onGoLogin: () => void;
}

export const RegisterForm: React.FC<Props> = ({ onGoLogin }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<string | undefined>(undefined);
  const [successKey, setSuccessKey] = useState<string | undefined>(undefined);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorKey(undefined);
      setSuccessKey(undefined);
      if (password !== confirm) {
        setErrorKey("auth.register.passwordMismatch");
        return;
      }
      setLoading(true);
      try {
        await authService.register({ name, email, password });
        setSuccessKey("auth.register.successCreated");
        await login({ email, password }, { remember: true });
        navigate("/books", { replace: true });
      } catch (err) {
        const raw = (err as Error).message || "";
        const key =
          /email.*registered|email.*existe/i.test(raw) ? "auth.register.errorEmailExists" : "auth.register.errorGeneric";
        setErrorKey(key);
      } finally {
        setLoading(false);
      }
    },
    [name, email, password, confirm, login, navigate]
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4" autoComplete="off">
      <h2 className="text-xl font-semibold text-gray-900">{t("auth.register.title")}</h2>
      <p className="text-sm text-gray-700">{t("auth.register.subtitle")}</p>
      <div className="space-y-1">
        <label className="mb-1 block text-sm font-medium text-gray-800">{t("auth.register.nameLabel")}</label>
        <div className="relative">
          <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("auth.register.namePlaceholder")}
            required
            autoComplete="off"
            onInvalid={(e) => e.currentTarget.setCustomValidity(t("auth.register.requiredName"))}
            onInput={(e) => e.currentTarget.setCustomValidity("")}
            className="pl-10 py-3 text-base"
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="mb-1 block text-sm font-medium text-gray-800">{t("auth.register.emailLabel")}</label>
        <div className="relative">
          <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("auth.register.emailPlaceholder")}
            required
            autoComplete="off"
            onInvalid={(e) => e.currentTarget.setCustomValidity(t("auth.register.requiredEmail"))}
          onInput={(e) => e.currentTarget.setCustomValidity("")}
            className="pl-10 py-3 text-base"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="mb-1 block text-sm font-medium text-gray-800">{t("auth.register.passwordLabel")}</label>
          <div className="relative">
            <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("auth.register.passwordPlaceholder")}
              required
            autoComplete="off"
              onInvalid={(e) => e.currentTarget.setCustomValidity(t("auth.register.requiredPassword"))}
              onInput={(e) => e.currentTarget.setCustomValidity("")}
              className="pl-10 py-3 text-base"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="mb-1 block text-sm font-medium text-gray-800">{t("auth.register.confirmLabel")}</label>
          <div className="relative">
            <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={t("auth.register.confirmPlaceholder")}
              required
            autoComplete="off"
              onInvalid={(e) => e.currentTarget.setCustomValidity(t("auth.register.requiredConfirm"))}
              onInput={(e) => e.currentTarget.setCustomValidity("")}
              className="pl-10 py-3 text-base"
            />
          </div>
        </div>
      </div>

      {errorKey && <Alert tone="error">{t(errorKey)}</Alert>}
      {successKey && <Alert tone="success">{t(successKey)}</Alert>}

      <Button
        type="submit"
        className="w-full gap-2 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white hover:from-indigo-500 hover:to-fuchsia-500 focus:ring-indigo-500"
        disabled={loading}
      >
        <UserPlus size={18} />
        {loading ? `${t("auth.register.submit")}...` : t("auth.register.submit")}
      </Button>

      <div className="flex items-center justify-between text-sm text-gray-700">
        <span>{t("auth.register.haveAccount")}</span>
        <button type="button" onClick={onGoLogin} className="font-medium text-indigo-600 underline-offset-2 hover:underline">
          {t("auth.register.goLogin")}
        </button>
      </div>
    </form>
  );
}


