"use client";

import Link from "next/link";
import { useState } from "react";

import { adminApiRequest } from "@/lib/adminApi";

const inputClassName =
  "mt-2 min-h-11 w-full rounded-md border border-black/12 bg-white px-3 text-sm outline-none transition-colors focus:border-[#516fc9] focus:ring-2 focus:ring-[#516fc9]/12";

export default function ResetPasswordForm({ token }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
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
    <form className="mt-7 grid gap-5" onSubmit={handleSubmit}>
      {!isComplete ? (
        <>
          <div>
            <label className="text-xs font-medium text-black/58" htmlFor="password">
              Yeni parola
            </label>
            <input
              autoComplete="new-password"
              className={inputClassName}
              disabled={tokenIsMissing}
              id="password"
              maxLength="128"
              minLength="12"
              name="password"
              required
              type="password"
            />
            <p className="mt-2 text-xs leading-5 text-black/42">
              En az 12 karakter kullanın.
            </p>
          </div>

          <div>
            <label
              className="text-xs font-medium text-black/58"
              htmlFor="passwordConfirmation"
            >
              Yeni parola tekrar
            </label>
            <input
              autoComplete="new-password"
              className={inputClassName}
              disabled={tokenIsMissing}
              id="passwordConfirmation"
              maxLength="128"
              minLength="12"
              name="passwordConfirmation"
              required
              type="password"
            />
          </div>

          <button
            className="min-h-11 rounded-md bg-[#1f1f1f] px-4 text-sm font-medium text-white transition-colors hover:bg-[#516fc9] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting || tokenIsMissing}
            type="submit"
          >
            {isSubmitting ? "Güncelleniyor…" : "Parolayı güncelle"}
          </button>
        </>
      ) : null}

      <p
        aria-live="polite"
        className={`min-h-5 text-xs ${
          status.type === "success" ? "text-emerald-700" : "text-red-600"
        }`}
      >
        {tokenIsMissing
          ? "Sıfırlama bağlantısı eksik veya geçersiz. Yeni bir bağlantı isteyin."
          : status.message}
      </p>

      <Link
        className="text-center text-xs font-medium text-black/52 transition-colors hover:text-[#516fc9]"
        href={isComplete ? "/admin/login" : "/admin/forgot-password"}
      >
        {isComplete ? "Giriş yap" : "Yeni bağlantı iste"}
      </Link>
    </form>
  );
}
