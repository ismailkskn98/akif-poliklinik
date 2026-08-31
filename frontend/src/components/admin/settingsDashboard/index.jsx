"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useAdminSession } from "@/components/admin/adminShell";
import PasswordChangeForm from "@/components/admin/passwordChangeForm";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { adminApiRequest } from "@/lib/adminApi";
import {
  resolveBackendAssetUrl,
  shouldBypassImageOptimization,
} from "@/lib/imageSource";

const MAX_PHONE_NUMBERS = 8;
const MAX_DOCUMENT_SIZE = 8 * 1024 * 1024;
const DOCUMENT_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const SAVED_FEEDBACK_DURATION = 2000;
const inputClassName =
  "mt-2 min-h-10 w-full rounded-md border border-black/12 bg-white px-3 text-sm outline-none transition-colors focus:border-[#516fc9] focus:ring-2 focus:ring-[#516fc9]/12";
const emptySettings = {
  instagramUrl: "",
  phoneNumbers: [""],
  address: "",
  mapShareUrl: "",
  mapEmbedUrl: "",
  authorizationDocumentUrl: "",
  updatedAt: null,
};

function formatFileSize(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function SettingsDashboard() {
  const { logout, token } = useAdminSession();
  const documentInputRef = useRef(null);
  const documentPreviewUrlRef = useRef("");
  const savedFeedbackTimeoutRef = useRef(null);
  const [settings, setSettings] = useState(emptySettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemovingDocument, setIsRemovingDocument] = useState(false);
  const [isRemoveDocumentDialogOpen, setIsRemoveDocumentDialogOpen] =
    useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedDocumentPreviewUrl, setSelectedDocumentPreviewUrl] =
    useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const publishedDocumentUrl = resolveBackendAssetUrl(
    settings.authorizationDocumentUrl,
  );
  const documentPreviewUrl =
    selectedDocumentPreviewUrl || publishedDocumentUrl;

  useEffect(() => {
    adminApiRequest("/site-settings", { token })
      .then((siteSettings) => {
        setSettings(siteSettings);
      })
      .catch((error) => {
        if (error.status === 401) {
          logout();
          return;
        }

        setStatus({ type: "error", message: error.message });
        toast.add({
          title: "Ayarlar yüklenemedi",
          description: error.message,
          type: "error",
        });
      })
      .finally(() => setIsLoading(false));
  }, [logout, token]);

  useEffect(
    () => () => {
      if (savedFeedbackTimeoutRef.current) {
        clearTimeout(savedFeedbackTimeoutRef.current);
      }

      if (documentPreviewUrlRef.current) {
        URL.revokeObjectURL(documentPreviewUrlRef.current);
      }
    },
    [],
  );

  function clearSelectedDocument() {
    if (documentPreviewUrlRef.current) {
      URL.revokeObjectURL(documentPreviewUrlRef.current);
      documentPreviewUrlRef.current = "";
    }

    setSelectedDocument(null);
    setSelectedDocumentPreviewUrl("");

    if (documentInputRef.current) {
      documentInputRef.current.value = "";
    }
  }

  function selectDocument(file) {
    if (!file) {
      clearSelectedDocument();
      return;
    }

    if (!DOCUMENT_IMAGE_TYPES.has(file.type) || file.size > MAX_DOCUMENT_SIZE) {
      const message = "JPG, PNG veya WebP biçiminde, en fazla 8 MB bir görsel seçin.";

      if (documentInputRef.current) {
        documentInputRef.current.value = "";
      }

      setStatus({ type: "error", message });
      toast.add({
        title: "Belge görselini kontrol edin",
        description: message,
        type: "error",
      });
      return;
    }

    clearSelectedDocument();
    setStatus({ type: "", message: "" });

    const previewUrl = URL.createObjectURL(file);
    documentPreviewUrlRef.current = previewUrl;
    setSelectedDocument(file);
    setSelectedDocumentPreviewUrl(previewUrl);
  }

  function updatePhone(index, value) {
    setSettings((currentSettings) => ({
      ...currentSettings,
      phoneNumbers: currentSettings.phoneNumbers.map((phoneNumber, phoneIndex) =>
        phoneIndex === index ? value : phoneNumber,
      ),
    }));
  }

  function addPhone() {
    if (settings.phoneNumbers.length >= MAX_PHONE_NUMBERS) {
      const message = `En fazla ${MAX_PHONE_NUMBERS} telefon numarası ekleyebilirsiniz.`;

      setStatus({ type: "error", message });
      toast.add({
        title: "Telefon sınırına ulaşıldı",
        description: message,
        type: "warning",
      });
      return;
    }

    setSettings((currentSettings) => ({
      ...currentSettings,
      phoneNumbers: [...currentSettings.phoneNumbers, ""],
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

    if (settings.phoneNumbers.length > MAX_PHONE_NUMBERS) {
      const message = `En fazla ${MAX_PHONE_NUMBERS} telefon numarası kaydedebilirsiniz.`;

      setStatus({ type: "error", message });
      toast.add({
        title: "Telefon numaralarını kontrol edin",
        description: message,
        type: "error",
      });
      return;
    }

    if (savedFeedbackTimeoutRef.current) {
      clearTimeout(savedFeedbackTimeoutRef.current);
    }

    setIsSaved(false);
    setIsSaving(true);
    setStatus({ type: "", message: "" });

    try {
      const updatedSettings = await adminApiRequest("/site-settings/update", {
        method: "PUT",
        token,
        body: {
          instagramUrl: settings.instagramUrl,
          phoneNumbers: settings.phoneNumbers,
          address: settings.address,
          mapShareUrl: settings.mapShareUrl,
          authorizationDocumentUrl: settings.authorizationDocumentUrl,
        },
      });

      setSettings(updatedSettings);
      const successMessage =
        "Değişiklikler kaydedildi. Site, yeni bilgileri sonraki istekte kullanır.";

      setStatus({
        type: "success",
        message: successMessage,
      });
      toast.add({
        title: "Değişiklikler kaydedildi",
        description: "Site yeni bilgileri sonraki istekte kullanır.",
        type: "success",
      });
      setIsSaved(true);
      savedFeedbackTimeoutRef.current = setTimeout(() => {
        setIsSaved(false);
        savedFeedbackTimeoutRef.current = null;
      }, SAVED_FEEDBACK_DURATION);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
      toast.add({
        title: "Değişiklikler kaydedilemedi",
        description: error.message,
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function uploadDocument(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!selectedDocument) {
      const message = "Yüklenecek belge görselini seçin.";

      setStatus({ type: "error", message });
      toast.add({ title: "Belge seçilmedi", description: message, type: "warning" });
      return;
    }

    setIsUploading(true);
    setStatus({ type: "", message: "" });
    const formData = new FormData();
    formData.append("document", selectedDocument);

    try {
      const updatedSettings = await adminApiRequest(
        "/site-settings/authorization-document",
        { method: "POST", token, body: formData },
      );
      setSettings(updatedSettings);
      clearSelectedDocument();
      form.reset();
      setStatus({ type: "success", message: "Yetki belgesi güncellendi." });
      toast.add({
        title: "Yetki belgesi güncellendi",
        description: "Yeni belge sitede kullanılmaya hazır.",
        type: "success",
      });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
      toast.add({
        title: "Belge güncellenemedi",
        description: error.message,
        type: "error",
      });
    } finally {
      setIsUploading(false);
    }
  }

  async function removeDocument() {
    setIsRemovingDocument(true);
    setStatus({ type: "", message: "" });

    try {
      const updatedSettings = await adminApiRequest(
        "/site-settings/authorization-document",
        { method: "DELETE", token },
      );

      setSettings(updatedSettings);
      setIsRemoveDocumentDialogOpen(false);
      setStatus({
        type: "success",
        message: "Yetki belgesi kaldırıldı. Yeni belge yüklenene kadar sitede gösterilmeyecek.",
      });
      toast.add({
        title: "Yetki belgesi kaldırıldı",
        description: "Belge bağlantısı ve sayfası siteden gizlendi.",
        type: "success",
      });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
      toast.add({
        title: "Belge kaldırılamadı",
        description: error.message,
        type: "error",
      });
    } finally {
      setIsRemovingDocument(false);
    }
  }

  if (isLoading) {
    return (
      <main className="grid min-h-[24rem] place-items-center px-5 text-sm text-black/50">
        Site ayarları yükleniyor…
      </main>
    );
  }

  return (
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
                    aria-disabled={settings.phoneNumbers.length >= MAX_PHONE_NUMBERS}
                    className="text-xs font-medium text-[#516fc9] transition-colors duration-200 ease-[cubic-bezier(.33,1,.68,1)] aria-disabled:text-black/35"
                    onClick={addPhone}
                    type="button"
                  >
                    Numara ekle · {settings.phoneNumbers.length}/{MAX_PHONE_NUMBERS}
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
                <p className="mt-2 text-xs leading-5 text-black/42">
                  En fazla {MAX_PHONE_NUMBERS} telefon numarası eklenebilir.
                </p>
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

              <div>
                <label className="text-xs font-medium text-black/58" htmlFor="mapShareUrl">
                  Google Maps paylaşım bağlantısı
                </label>
                <input
                  className={inputClassName}
                  id="mapShareUrl"
                  onChange={(event) =>
                    setSettings((currentSettings) => ({
                      ...currentSettings,
                      mapShareUrl: event.target.value,
                    }))
                  }
                  placeholder="https://maps.app.goo.gl/..."
                  required
                  type="url"
                  value={settings.mapShareUrl}
                />
                <p className="mt-2 text-xs leading-5 text-black/42">
                  İşletme adının, pin etiketinin ve Google bilgi kartının görünmesi için
                  koordinat yerine doğru işletme kaydını açın. Ardından
                  <strong className="font-medium text-black/58"> Paylaş</strong> düğmesine
                  basıp <strong className="font-medium text-black/58">Bağlantıyı kopyala</strong>
                  seçeneğiyle aldığınız adresi buraya yapıştırın.
                </p>
                {settings.mapShareUrl ? (
                  <a
                    className="mt-2 inline-flex text-xs font-medium text-[#516fc9] hover:underline"
                    href={settings.mapShareUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Kayıtlı konumu Google Maps’te kontrol et ↗
                  </a>
                ) : null}
              </div>
            </div>

            <button
              className="mt-7 min-h-10 min-w-44 rounded-md bg-[#1f1f1f] px-4 text-sm font-medium text-white transition-[background-color,opacity] duration-250 ease-[cubic-bezier(.33,1,.68,1)] hover:bg-[#516fc9] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSaving}
              type="submit"
            >
              {isSaving
                ? "Kaydediliyor…"
                : isSaved
                  ? "Kaydedildi"
                  : "Değişiklikleri kaydet"}
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
              {documentPreviewUrl ? (
                <Image
                  alt={
                    selectedDocumentPreviewUrl
                      ? "Seçilen yetki belgesi önizlemesi"
                      : "Yayındaki yetki belgesi"
                  }
                  className="object-contain p-3"
                  fill
                  sizes="(max-width: 1024px) 100vw, 35vw"
                  src={documentPreviewUrl}
                  unoptimized={
                    Boolean(selectedDocumentPreviewUrl) ||
                    shouldBypassImageOptimization(documentPreviewUrl)
                  }
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center px-6 text-center">
                  <div>
                    <p className="text-sm font-medium text-black/58">
                      Yayında bir yetki belgesi yok
                    </p>
                    <p className="mt-1 text-xs leading-5 text-black/38">
                      Belge yüklenene kadar site menüsünde ve belge sayfasında gösterilmez.
                    </p>
                  </div>
                </div>
              )}
              {selectedDocumentPreviewUrl ? (
                <span className="absolute start-3 top-3 rounded-sm border border-[#516fc9]/20 bg-white/95 px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.08em] text-[#516fc9] uppercase shadow-[0_1px_3px_rgba(0,0,0,.06)]">
                  Yeni belge önizlemesi
                </span>
              ) : settings.authorizationDocumentUrl ? (
                <span className="absolute start-3 top-3 rounded-sm border border-black/8 bg-white/95 px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.08em] text-black/48 uppercase shadow-[0_1px_3px_rgba(0,0,0,.06)]">
                  Yayındaki belge
                </span>
              ) : null}
            </div>

            <form className="mt-5" onSubmit={uploadDocument}>
              <p className="text-xs font-medium text-black/58">
                Yeni belge görseli
              </p>
              <input
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                id="document"
                onChange={(event) => selectDocument(event.target.files?.[0] || null)}
                ref={documentInputRef}
                type="file"
              />
              <div className="mt-2 flex min-h-16 flex-col gap-3 rounded-md border border-black/10 bg-white px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-black/72">
                    {selectedDocument
                      ? selectedDocument.name
                      : "Yüklenecek belgeyi seçin"}
                  </p>
                  <p className="mt-1 text-xs text-black/38">
                    {selectedDocument
                      ? `${formatFileSize(selectedDocument.size)} · Yüklemeden önce önizlemeyi kontrol edin`
                      : "JPG, PNG veya WebP · en fazla 8 MB"}
                  </p>
                </div>
                <label
                  className="inline-flex min-h-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-black/12 bg-white px-3 text-xs font-medium text-black/68 transition-colors hover:border-[#516fc9] hover:text-[#516fc9]"
                  htmlFor="document"
                >
                  {selectedDocument ? "Dosyayı değiştir" : "Dosya seç"}
                </label>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  className="min-h-10 rounded-md bg-[#1f1f1f] px-4 text-sm font-medium text-white transition-colors hover:bg-[#516fc9] disabled:cursor-not-allowed disabled:bg-black/8 disabled:text-black/32"
                  disabled={!selectedDocument || isUploading || isRemovingDocument}
                  type="submit"
                >
                  {isUploading ? "Yükleniyor…" : "Belgeyi yükle"}
                </button>
                {selectedDocument ? (
                  <button
                    className="min-h-10 rounded-md border border-black/12 bg-white px-4 text-sm font-medium text-black/58 transition-colors hover:border-black/24 hover:text-black"
                    disabled={isUploading}
                    onClick={clearSelectedDocument}
                    type="button"
                  >
                    Seçimi iptal et
                  </button>
                ) : null}
                {settings.authorizationDocumentUrl ? (
                  <button
                    className="min-h-10 rounded-md border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isUploading || isRemovingDocument}
                    onClick={() => setIsRemoveDocumentDialogOpen(true)}
                    type="button"
                  >
                    Belgeyi kaldır
                  </button>
                ) : null}
              </div>
            </form>
          </section>
        </div>

        <PasswordChangeForm
          onSessionEnded={logout}
          token={token}
        />

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

        <Dialog
          onOpenChange={setIsRemoveDocumentDialogOpen}
          open={isRemoveDocumentDialogOpen}
        >
          <DialogContent
            className="bg-white p-5 sm:rounded-xl sm:p-6"
            variant="responsive"
          >
            <DialogTitle className="text-lg font-semibold tracking-[-0.02em]">
              Yetki belgesi kaldırılsın mı?
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-6 text-black/52">
              Belge, site menüsünden ve belge sayfasından hemen gizlenir. Daha sonra
              yeni belgeyi bu alandan tekrar yükleyebilirsiniz.
            </DialogDescription>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <DialogClose className="min-h-10 rounded-lg border border-black/10 px-4 text-sm font-medium text-black/68 transition-colors hover:bg-black/[.025]">
                Vazgeç
              </DialogClose>
              <button
                className="min-h-10 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isRemovingDocument}
                onClick={removeDocument}
                type="button"
              >
                {isRemovingDocument ? "Kaldırılıyor…" : "Belgeyi kaldır"}
              </button>
            </div>
          </DialogContent>
        </Dialog>
    </main>
  );
}
