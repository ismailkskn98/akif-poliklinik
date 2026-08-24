"use client";

import Link from "next/link";
import { useState } from "react";

import { adminApiRequest } from "@/lib/adminApi";

const inputClassName =
  "mt-2 min-h-11 w-full rounded-md border border-black/12 bg-white px-3 text-sm outline-none transition-colors focus:border-[#516fc9] focus:ring-2 focus:ring-[#516fc9]/12";

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
    <form className="mt-7 grid gap-5" onSubmit={handleSubmit}>
      <div>
        <label className="text-xs font-medium text-black/58" htmlFor="email">
          Yönetici e-postası
        </label>
        <input
          autoComplete="email"
          className={inputClassName}
          id="email"
          maxLength="190"
          name="email"
          required
          type="email"
        />
      </div>

      <button
        className="min-h-11 rounded-md bg-[#1f1f1f] px-4 text-sm font-medium text-white transition-colors hover:bg-[#516fc9] disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Gönderiliyor…" : "Sıfırlama bağlantısı gönder"}
      </button>

      <p
        aria-live="polite"
        className={`min-h-5 text-xs ${
          status.type === "success" ? "text-emerald-700" : "text-red-600"
        }`}
      >
        {status.message}
      </p>

      <Link
        className="text-center text-xs font-medium text-black/52 transition-colors hover:text-[#516fc9]"
        href="/admin/login"
      >
        Giriş ekranına dön
      </Link>
    </form>
  );
}
