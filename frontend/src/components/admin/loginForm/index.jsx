"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { adminApiRequest, adminSessionKey } from "@/lib/adminApi";

const inputClassName =
  "mt-2 min-h-11 w-full rounded-md border border-black/12 bg-white px-3 text-sm outline-none transition-colors focus:border-[#516fc9] focus:ring-2 focus:ring-[#516fc9]/12";

export default function AdminLoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const session = await adminApiRequest("/auth/login", {
        method: "POST",
        body: {
          email: formData.get("email"),
          password: formData.get("password"),
        },
      });

      sessionStorage.setItem(adminSessionKey, JSON.stringify(session));
      router.replace("/admin");
      router.refresh();
    } catch (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-7 grid gap-5" onSubmit={handleSubmit}>
      <div>
        <label className="text-xs font-medium text-black/58" htmlFor="email">
          E-posta
        </label>
        <input
          autoComplete="email"
          className={inputClassName}
          id="email"
          name="email"
          required
          type="email"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-black/58" htmlFor="password">
          Parola
        </label>
        <input
          autoComplete="current-password"
          className={inputClassName}
          id="password"
          minLength="8"
          name="password"
          required
          type="password"
        />
      </div>

      <div className="-mt-2 flex justify-end">
        <Link
          className="text-xs font-medium text-[#516fc9] transition-colors hover:text-[#3f5cb5]"
          href="/admin/forgot-password"
        >
          Parolamı unuttum
        </Link>
      </div>

      <button
        className="min-h-11 rounded-md bg-[#1f1f1f] px-4 text-sm font-medium text-white transition-colors hover:bg-[#516fc9] disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Giriş yapılıyor…" : "Giriş yap"}
      </button>

      <p aria-live="polite" className="min-h-5 text-xs text-red-600">
        {errorMessage}
      </p>
    </form>
  );
}
