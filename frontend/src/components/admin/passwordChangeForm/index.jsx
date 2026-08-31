"use client";

import { Eye, EyeSlash } from "@phosphor-icons/react";
import { useState } from "react";

import { toast } from "@/components/ui/toast";
import { adminApiRequest } from "@/lib/adminApi";

const inputClassName =
  "mt-2 min-h-10 w-full rounded-md border border-black/12 bg-white px-3 text-sm outline-none transition-colors focus:border-[#516fc9] focus:ring-2 focus:ring-[#516fc9]/12";

export default function PasswordChangeForm({ onSessionEnded, token }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const currentPassword = String(formData.get("currentPassword") || "");
    const newPassword = String(formData.get("newPassword") || "");
    const passwordConfirmation = String(
      formData.get("passwordConfirmation") || "",
    );

    if (newPassword !== passwordConfirmation) {
      setStatus({ type: "error", message: "Yeni parolalar birbiriyle eşleşmiyor." });
      return;
    }

    if (currentPassword === newPassword) {
      setStatus({
        type: "error",
        message: "Yeni parola mevcut paroladan farklı olmalıdır.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      await adminApiRequest("/auth/change-password", {
        method: "PUT",
        token,
        body: { currentPassword, newPassword },
      });
      form.reset();
      toast.add({
        title: "Parola güncellendi",
        description: "Yeni parolanızla tekrar giriş yapın.",
        type: "success",
      });
      onSessionEnded();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
      toast.add({
        title: "Parola güncellenemedi",
        description: error.message,
        type: "error",
      });

      if (error.status === 401) {
        onSessionEnded();
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-5 rounded-lg border border-black/8 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,.03)] sm:p-6">
      <div className="grid gap-7 lg:grid-cols-[.72fr_1.28fr] lg:gap-10">
        <div className="lg:py-1 lg:pe-6">
          <p className="text-xs font-medium tracking-[0.12em] text-black/40 uppercase">
            Hesap güvenliği
          </p>
          <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em]">
            Yönetici parolası
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-black/48">
            Parolanızı değiştirdiğinizde açık yönetici oturumları kapatılır. Yeni
            parolanızla tekrar giriş yapmanız gerekir.
          </p>
        </div>

        <form
          className="grid gap-5 border-t border-black/8 pt-6 sm:grid-cols-2 lg:border-s lg:border-t-0 lg:ps-10 lg:pt-1"
          onSubmit={handleSubmit}
        >
          <div className="sm:col-span-2">
            <label
              className="text-xs font-medium text-black/58"
              htmlFor="currentPassword"
            >
              Mevcut parola
            </label>
            <div className="relative">
              <input
                autoComplete="current-password"
                className={`${inputClassName} pe-12`}
                id="currentPassword"
                maxLength="128"
                name="currentPassword"
                required
                type={showCurrentPassword ? "text" : "password"}
              />
              <button
                aria-label={
                  showCurrentPassword ? "Mevcut parolayı gizle" : "Mevcut parolayı göster"
                }
                aria-pressed={showCurrentPassword}
                className="absolute end-1 top-2 grid size-10 place-items-center rounded text-black/42 transition-colors hover:bg-black/[.04] hover:text-black/70"
                onClick={() => setShowCurrentPassword((currentValue) => !currentValue)}
                type="button"
              >
                {showCurrentPassword ? (
                  <EyeSlash aria-hidden="true" className="size-4" weight="light" />
                ) : (
                  <Eye aria-hidden="true" className="size-4" weight="light" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-black/58" htmlFor="newPassword">
              Yeni parola
            </label>
            <div className="relative">
              <input
                autoComplete="new-password"
                className={`${inputClassName} pe-12`}
                id="newPassword"
                maxLength="128"
                minLength="12"
                name="newPassword"
                required
                type={showNewPassword ? "text" : "password"}
              />
              <button
                aria-label={showNewPassword ? "Yeni parolayı gizle" : "Yeni parolayı göster"}
                aria-pressed={showNewPassword}
                className="absolute end-1 top-2 grid size-10 place-items-center rounded text-black/42 transition-colors hover:bg-black/[.04] hover:text-black/70"
                onClick={() => setShowNewPassword((currentValue) => !currentValue)}
                type="button"
              >
                {showNewPassword ? (
                  <EyeSlash aria-hidden="true" className="size-4" weight="light" />
                ) : (
                  <Eye aria-hidden="true" className="size-4" weight="light" />
                )}
              </button>
            </div>
            <p className="mt-2 text-xs leading-5 text-black/42">
              En az 12, en fazla 128 karakter kullanın.
            </p>
          </div>

          <div>
            <label
              className="text-xs font-medium text-black/58"
              htmlFor="passwordConfirmation"
            >
              Yeni parola tekrar
            </label>
            <div className="relative">
              <input
                autoComplete="new-password"
                className={`${inputClassName} pe-12`}
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
                className="absolute end-1 top-2 grid size-10 place-items-center rounded text-black/42 transition-colors hover:bg-black/[.04] hover:text-black/70"
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

          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
            <button
              aria-busy={isSubmitting}
              className="min-h-10 shrink-0 rounded-md bg-[#1f1f1f] px-4 text-sm font-medium text-white transition-colors hover:bg-[#516fc9] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Güncelleniyor…" : "Parolayı güncelle"}
            </button>

            <p
              aria-live="polite"
              className={`min-h-5 text-xs ${status.type === "error" ? "text-red-600" : "text-black/48"}`}
            >
              {status.message}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
