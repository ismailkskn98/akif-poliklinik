"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { adminApiRequest, adminSessionKey } from "@/lib/adminApi";

const inputClassName =
  "mt-2 min-h-10 w-full rounded-md border border-black/12 bg-white px-3 text-sm outline-none transition-colors focus:border-[#516fc9] focus:ring-2 focus:ring-[#516fc9]/12";
const emptySettings = {
  instagramUrl: "",
  phoneNumbers: [""],
  address: "",
  authorizationDocumentUrl: "",
  updatedAt: null,
};

export default function SettingsDashboard() {
  const router = useRouter();
  const sessionRef = useRef(null);
  const [settings, setSettings] = useState(emptySettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    const storedSession = sessionStorage.getItem(adminSessionKey);

    if (!storedSession) {
      router.replace("/admin/login");
      return;
    }

    let parsedSession;

    try {
      parsedSession = JSON.parse(storedSession);
    } catch {
      sessionStorage.removeItem(adminSessionKey);
      router.replace("/admin/login");
      return;
    }

    sessionRef.current = parsedSession;

    adminApiRequest("/site-settings", { token: parsedSession.token })
      .then((siteSettings) => {
        setSettings(siteSettings);
      })
      .catch((error) => {
        if (error.status === 401) {
          sessionStorage.removeItem(adminSessionKey);
          router.replace("/admin/login");
          return;
        }

        setStatus({ type: "error", message: error.message });
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  function updatePhone(index, value) {
    setSettings((currentSettings) => ({
      ...currentSettings,
      phoneNumbers: currentSettings.phoneNumbers.map((phoneNumber, phoneIndex) =>
        phoneIndex === index ? value : phoneNumber,
      ),
    }));
  }

  function addPhone() {
    setSettings((currentSettings) => ({
      ...currentSettings,
      phoneNumbers:
        currentSettings.phoneNumbers.length >= 6
          ? currentSettings.phoneNumbers
          : [...currentSettings.phoneNumbers, ""],
    }));
  }

  function removePhone(index) {
    setSettings((currentSettings) => ({
      ...currentSettings,
      phoneNumbers:
        currentSettings.phoneNumbers.length === 1
          ? currentSettings.phoneNumbers
          : currentSettings.phoneNumbers.filter((_, phoneIndex) => phoneIndex !== index),
    }));
  }

  async function saveSettings(event) {
    event.preventDefault();
    setIsSaving(true);
    setStatus({ type: "", message: "" });

    try {
      const updatedSettings = await adminApiRequest("/site-settings/update", {
        method: "PUT",
        token: sessionRef.current?.token,
        body: {
          instagramUrl: settings.instagramUrl,
          phoneNumbers: settings.phoneNumbers,
          address: settings.address,
          authorizationDocumentUrl: settings.authorizationDocumentUrl,
        },
      });

      setSettings(updatedSettings);
      setStatus({
        type: "success",
        message: "Değişiklikler kaydedildi. Site, yeni bilgileri sonraki istekte kullanır.",
      });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSaving(false);
    }
  }

  async function uploadDocument(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!selectedDocument) {
      setStatus({ type: "error", message: "Yüklenecek belge görselini seçin." });
      return;
    }

    setIsUploading(true);
    setStatus({ type: "", message: "" });
    const formData = new FormData();
    formData.append("document", selectedDocument);

    try {
      const updatedSettings = await adminApiRequest(
        "/site-settings/authorization-document",
        { method: "POST", token: sessionRef.current?.token, body: formData },
      );
      setSettings(updatedSettings);
      setSelectedDocument(null);
      form.reset();
      setStatus({ type: "success", message: "Yetki belgesi güncellendi." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsUploading(false);
    }
  }

  function logout() {
    sessionStorage.removeItem(adminSessionKey);
    router.replace("/admin/login");
  }

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center px-5 text-sm text-black/50">
        Site ayarları yükleniyor…
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="border-b border-black/8 bg-white">
        <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-4 px-5">
          <div>
            <p className="text-sm font-semibold">Akif Poliklinik</p>
            <p className="text-xs text-black/45">Site yönetimi</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="rounded-md border border-black/10 bg-white px-3 py-2 text-xs font-medium transition-colors hover:bg-black/[.04]"
              onClick={logout}
              type="button"
            >
              Çıkış yap
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.14em] text-black/42 uppercase">
              Genel ayarlar
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              İletişim ve belgeler
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/52">
              Yalnızca site genelinde ortak kullanılan temel bilgiler veritabanından
              yönetilir. Çeviriler ve sayfa içerikleri kod içinde statik kalır.
            </p>
          </div>
          <a
            className="text-xs font-medium text-[#516fc9] hover:underline"
            href="/"
            target="_blank"
            rel="noreferrer"
          >
            Siteyi görüntüle ↗
          </a>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
          <form
            className="rounded-lg border border-black/8 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,.03)] sm:p-6"
            onSubmit={saveSettings}
          >
            <div className="border-b border-black/8 pb-5">
              <h2 className="text-sm font-semibold">İletişim bilgileri</h2>
              <p className="mt-1 text-xs leading-5 text-black/46">
                Header, anasayfa, harita ve footer aynı kayıtları kullanır.
              </p>
            </div>

            <div className="mt-6 grid gap-6">
              <div>
                <label className="text-xs font-medium text-black/58" htmlFor="instagramUrl">
                  Instagram adresi
                </label>
                <input
                  className={inputClassName}
                  id="instagramUrl"
                  onChange={(event) =>
                    setSettings((currentSettings) => ({
                      ...currentSettings,
                      instagramUrl: event.target.value,
                    }))
                  }
                  required
                  type="url"
                  value={settings.instagramUrl}
                />
              </div>

              <fieldset>
                <div className="flex items-center justify-between gap-3">
                  <legend className="text-xs font-medium text-black/58">Telefon numaraları</legend>
                  <button
                    className="text-xs font-medium text-[#516fc9] disabled:opacity-40"
                    disabled={settings.phoneNumbers.length >= 6}
                    onClick={addPhone}
                    type="button"
                  >
                    Numara ekle
                  </button>
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {settings.phoneNumbers.map((phoneNumber, index) => (
                    <div className="flex gap-2" key={`${index}-${settings.phoneNumbers.length}`}>
                      <input
                        aria-label={`${index + 1}. telefon numarası`}
                        className="min-h-10 min-w-0 flex-1 rounded-md border border-black/12 bg-white px-3 text-sm outline-none transition-colors focus:border-[#516fc9] focus:ring-2 focus:ring-[#516fc9]/12"
                        onChange={(event) => updatePhone(index, event.target.value)}
                        required
                        type="tel"
                        value={phoneNumber}
                      />
                      <button
                        aria-label={`${index + 1}. telefon numarasını kaldır`}
                        className="rounded-md border border-black/10 px-3 text-sm text-black/45 transition-colors hover:border-red-200 hover:text-red-600 disabled:opacity-30"
                        disabled={settings.phoneNumbers.length === 1}
                        onClick={() => removePhone(index)}
                        type="button"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </fieldset>

              <div>
                <label className="text-xs font-medium text-black/58" htmlFor="address">
                  Adres
                </label>
                <textarea
                  className={`${inputClassName} min-h-28 py-3`}
                  id="address"
                  onChange={(event) =>
                    setSettings((currentSettings) => ({
                      ...currentSettings,
                      address: event.target.value,
                    }))
                  }
                  required
                  value={settings.address}
                />
              </div>
            </div>

            <button
              className="mt-7 min-h-10 rounded-md bg-[#1f1f1f] px-4 text-sm font-medium text-white transition-colors hover:bg-[#516fc9] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? "Kaydediliyor…" : "Değişiklikleri kaydet"}
            </button>
          </form>

          <section className="rounded-lg border border-black/8 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,.03)] sm:p-6">
            <div className="border-b border-black/8 pb-5">
              <h2 className="text-sm font-semibold">Yetki belgesi</h2>
              <p className="mt-1 text-xs leading-5 text-black/46">
                JPG, PNG veya WebP · en fazla 8 MB
              </p>
            </div>

            <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-md border border-black/8 bg-black/[.025]">
              {settings.authorizationDocumentUrl ? (
                <Image
                  alt="Mevcut yetki belgesi"
                  className="object-contain p-3"
                  fill
                  sizes="(max-width: 1024px) 100vw, 35vw"
                  src={settings.authorizationDocumentUrl}
                />
              ) : null}
            </div>

            <form className="mt-5" onSubmit={uploadDocument}>
              <label className="text-xs font-medium text-black/58" htmlFor="document">
                Yeni belge görseli
              </label>
              <input
                accept="image/jpeg,image/png,image/webp"
                className="mt-2 block w-full rounded-md border border-black/10 bg-white p-2 text-xs file:me-3 file:rounded file:border-0 file:bg-black/[.06] file:px-3 file:py-2 file:text-xs file:font-medium"
                id="document"
                onChange={(event) => setSelectedDocument(event.target.files?.[0] || null)}
                type="file"
              />
              <button
                className="mt-4 min-h-10 rounded-md border border-black/12 bg-white px-4 text-sm font-medium transition-colors hover:border-[#516fc9] hover:text-[#516fc9] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isUploading}
                type="submit"
              >
                {isUploading ? "Yükleniyor…" : "Belgeyi yükle"}
              </button>
            </form>
          </section>
        </div>

        <div
          aria-live="polite"
          className={`mt-5 min-h-10 rounded-md border px-4 py-3 text-sm ${
            status.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : status.type === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-transparent"
          }`}
        >
          {status.message}
        </div>
      </main>
    </div>
  );
}
