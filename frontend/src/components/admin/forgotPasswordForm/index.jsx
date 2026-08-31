"use client";

import Link from "next/link";
import { useState } from "react";

import {
  authInputClassName,
  authLabelClassName,
  authPrimaryButtonClassName,
  authSecondaryLinkClassName,
} from "@/components/admin/authFormStyles";
import { adminApiRequest } from "@/lib/adminApi";

export default function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });
    const formData = new FormData(event.currentTarget);

    try {
      await adminApiRequest("/auth/forgot-password", {
        method: "POST",
        body: { email: formData.get("email") },
      });
      setStatus({
        type: "success",
        message:
          "Bu e-postaya bağlı aktif bir hesap varsa sıfırlama bağlantısı gönderildi.",
      });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-7 grid gap-5 text-start" onSubmit={handleSubmit}>
      <div>
        <label className={authLabelClassName} htmlFor="email">
          Yönetici e-postası
        </label>
        <input
          autoComplete="email"
          className={authInputClassName}
          id="email"
          maxLength="190"
          name="email"
          required
          type="email"
        />
      </div>

      <button
        className={authPrimaryButtonClassName}
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Gönderiliyor…" : "Sıfırlama bağlantısı gönder"}
      </button>

      <p
        aria-live="polite"
        className={`min-h-5 text-xs leading-5 ${
          status.type === "success" ? "text-emerald-700" : "text-red-600"
        }`}
      >
        {status.message}
      </p>

      <Link
        className={`${authSecondaryLinkClassName} justify-self-center text-center`}
        href="/admin/login"
      >
        Giriş ekranına dön
      </Link>
    </form>
  );
}
