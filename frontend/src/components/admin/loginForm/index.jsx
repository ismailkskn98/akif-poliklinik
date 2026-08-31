"use client";

import { Eye, EyeSlash } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  authInputClassName,
  authLabelClassName,
  authPasswordButtonClassName,
  authPrimaryButtonClassName,
  authSecondaryLinkClassName,
} from "@/components/admin/authFormStyles";
import { adminApiRequest, adminSessionKey } from "@/lib/adminApi";

export default function AdminLoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    <form className="mt-7 grid gap-5 text-start" onSubmit={handleSubmit}>
      <div>
        <label className={authLabelClassName} htmlFor="email">
          E-posta
        </label>
        <input
          autoComplete="email"
          className={authInputClassName}
          id="email"
          name="email"
          required
          type="email"
        />
      </div>

      <div>
        <label className={authLabelClassName} htmlFor="password">
          Parola
        </label>
        <div className="relative">
          <input
            autoComplete="current-password"
            className={`${authInputClassName} pe-12`}
            id="password"
            minLength="12"
            name="password"
            required
            type={showPassword ? "text" : "password"}
          />
          <button
            aria-label={showPassword ? "Parolayı gizle" : "Parolayı göster"}
            aria-pressed={showPassword}
            className={authPasswordButtonClassName}
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
      </div>

      <div className="-mt-2 flex justify-end">
        <Link
          className={authSecondaryLinkClassName}
          href="/admin/forgot-password"
        >
          Parolamı unuttum
        </Link>
      </div>

      <button
        className={authPrimaryButtonClassName}
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Giriş yapılıyor…" : "Giriş yap"}
      </button>

      <p aria-live="polite" className="min-h-5 text-xs leading-5 text-red-600">
        {errorMessage}
      </p>
    </form>
  );
}
