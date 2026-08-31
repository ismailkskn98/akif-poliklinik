"use client";

import { Eye, EyeSlash } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";

import {
  authInputClassName,
  authLabelClassName,
  authPasswordButtonClassName,
  authPrimaryButtonClassName,
  authSecondaryLinkClassName,
} from "@/components/admin/authFormStyles";
import { adminApiRequest } from "@/lib/adminApi";

export default function ResetPasswordForm({ token }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") || "");
    const passwordConfirmation = String(formData.get("passwordConfirmation") || "");

    if (password !== passwordConfirmation) {
      setStatus({ type: "error", message: "Parolalar birbiriyle eşleşmiyor." });
      return;
    }

    setIsSubmitting(true);

    try {
      await adminApiRequest("/auth/reset-password", {
        method: "POST",
        body: { token, password },
      });
      setIsComplete(true);
      setStatus({
        type: "success",
        message: "Parolanız güncellendi. Yeni parolanızla giriş yapabilirsiniz.",
      });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  const tokenIsMissing = !token;

  return (
    <form className="mt-7 grid gap-5 text-start" onSubmit={handleSubmit}>
      {!isComplete ? (
        <>
          <div>
            <label className={authLabelClassName} htmlFor="password">
              Yeni parola
            </label>
            <div className="relative">
              <input
                autoComplete="new-password"
                className={`${authInputClassName} pe-12`}
                disabled={tokenIsMissing}
                id="password"
                maxLength="128"
                minLength="12"
                name="password"
                required
                type={showPassword ? "text" : "password"}
              />
              <button
                aria-label={showPassword ? "Parolayı gizle" : "Parolayı göster"}
                aria-pressed={showPassword}
                className={authPasswordButtonClassName}
                disabled={tokenIsMissing}
                onClick={() => setShowPassword((currentValue) => !currentValue)}
                type="button"
              >
                {showPassword ? (
                  <EyeSlash aria-hidden="true" className="size-4" weight="light" />
                ) : (
                  <Eye aria-hidden="true" className="size-4" weight="light" />
                )}
              </button>
            </div>
            <p className="mt-2 text-xs leading-5 text-black/42">
              En az 12 karakter kullanın.
            </p>
          </div>

          <div>
            <label
              className={authLabelClassName}
              htmlFor="passwordConfirmation"
            >
              Yeni parola tekrar
            </label>
            <div className="relative">
              <input
                autoComplete="new-password"
                className={`${authInputClassName} pe-12`}
                disabled={tokenIsMissing}
                id="passwordConfirmation"
                maxLength="128"
                minLength="12"
                name="passwordConfirmation"
                required
                type={showPasswordConfirmation ? "text" : "password"}
              />
              <button
                aria-label={
                  showPasswordConfirmation
                    ? "Parola tekrarını gizle"
                    : "Parola tekrarını göster"
                }
                aria-pressed={showPasswordConfirmation}
                className={authPasswordButtonClassName}
                disabled={tokenIsMissing}
                onClick={() =>
                  setShowPasswordConfirmation((currentValue) => !currentValue)
                }
                type="button"
              >
                {showPasswordConfirmation ? (
                  <EyeSlash aria-hidden="true" className="size-4" weight="light" />
                ) : (
                  <Eye aria-hidden="true" className="size-4" weight="light" />
                )}
              </button>
            </div>
          </div>

          <button
            className={authPrimaryButtonClassName}
            disabled={isSubmitting || tokenIsMissing}
            type="submit"
          >
            {isSubmitting ? "Güncelleniyor…" : "Parolayı güncelle"}
          </button>
        </>
      ) : null}

      <p
        aria-live="polite"
        className={`min-h-5 text-xs leading-5 ${
          status.type === "success" ? "text-emerald-700" : "text-red-600"
        }`}
      >
        {tokenIsMissing
          ? "Sıfırlama bağlantısı eksik veya geçersiz. Yeni bir bağlantı isteyin."
          : status.message}
      </p>

      <Link
        className={`${authSecondaryLinkClassName} justify-self-center text-center`}
        href={isComplete ? "/admin/login" : "/admin/forgot-password"}
      >
        {isComplete ? "Giriş yap" : "Yeni bağlantı iste"}
      </Link>
    </form>
  );
}
