"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, UploadSimple, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import DoctorImage from "@/components/doctorImage";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const inputClassName =
  "mt-2 block min-h-11 w-full rounded-lg border border-black/10 bg-white px-3.5 text-sm text-black outline-none transition-[border-color,box-shadow] placeholder:text-black/28 focus:border-[#516fc9] focus:ring-3 focus:ring-[#516fc9]/10 aria-invalid:border-red-400 aria-invalid:ring-red-500/10";
const labelClassName = "block text-xs font-medium leading-5 text-black/58";

const doctorSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Unvan en az 2 karakter olmalıdır.")
      .max(80, "Unvan en fazla 80 karakter olabilir."),
    fullName: z
      .string()
      .trim()
      .min(2, "Ad soyad en az 2 karakter olmalıdır.")
      .max(150, "Ad soyad en fazla 150 karakter olabilir."),
    sortOrder: z
      .number({ error: "Geçerli bir sıra numarası girin." })
      .int("Sıra numarası tam sayı olmalıdır.")
      .min(0, "Sıra numarası 0'dan küçük olamaz.")
      .max(999, "Sıra numarası en fazla 999 olabilir."),
    isPublished: z.boolean(),
    existingImageUrl: z.string().optional(),
    image: z.any().optional(),
  })
  .superRefine((values, context) => {
    const file = values.image?.[0];

    if (!values.existingImageUrl && !file) {
      context.addIssue({
        code: "custom",
        message: "Doktor fotoğrafını seçin.",
        path: ["image"],
      });
      return;
    }

    if (file && !allowedImageTypes.has(file.type)) {
      context.addIssue({
        code: "custom",
        message: "Fotoğraf JPG, PNG veya WebP biçiminde olmalıdır.",
        path: ["image"],
      });
    }

    if (file && file.size > MAX_IMAGE_SIZE) {
      context.addIssue({
        code: "custom",
        message: "Fotoğraf en fazla 8 MB olabilir.",
        path: ["image"],
      });
    }
  });

function FieldError({ children }) {
  if (!children) {
    return null;
  }

  return (
    <p className="mt-2 text-xs leading-5 text-red-600" role="alert">
      {children}
    </p>
  );
}

function DoctorForm({ doctor, nextSortOrder, onSubmit }) {
  const [previewUrl, setPreviewUrl] = useState(doctor?.imageUrl || "");
  const [selectedFileName, setSelectedFileName] = useState("");
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      title: doctor?.title || "Dr.",
      fullName: doctor?.fullName || "",
      sortOrder: doctor?.sortOrder ?? nextSortOrder,
      isPublished: doctor?.isPublished ?? true,
      existingImageUrl: doctor?.imageUrl || "",
      image: undefined,
    },
  });
  useEffect(
    () => () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    },
    [previewUrl],
  );

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    setSelectedFileName(file?.name || "");

    setPreviewUrl((currentPreviewUrl) => {
      if (currentPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(currentPreviewUrl);
      }

      return file ? URL.createObjectURL(file) : doctor?.imageUrl || "";
    });
  }

  return (
    <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6">
        <input type="hidden" {...register("existingImageUrl")} />

        <div className="space-y-7">
          <fieldset>
            <legend className="text-[0.68rem] font-semibold tracking-[0.12em] text-black/42 uppercase">
              Doktor bilgileri
            </legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-[.7fr_1.3fr]">
              <div>
                <label className={labelClassName} htmlFor="doctorTitle">
                  Unvan
                </label>
                <input
                  aria-invalid={Boolean(errors.title)}
                  className={inputClassName}
                  id="doctorTitle"
                  placeholder="Dr."
                  {...register("title")}
                />
                <FieldError>{errors.title?.message}</FieldError>
              </div>
              <div>
                <label className={labelClassName} htmlFor="doctorFullName">
                  Ad soyad
                </label>
                <input
                  aria-invalid={Boolean(errors.fullName)}
                  className={inputClassName}
                  id="doctorFullName"
                  placeholder="Ad Soyad"
                  {...register("fullName")}
                />
                <FieldError>{errors.fullName?.message}</FieldError>
              </div>
            </div>
          </fieldset>

          <fieldset className="border-t border-black/[.07] pt-6">
            <legend className="text-[0.68rem] font-semibold tracking-[0.12em] text-black/42 uppercase">
              Doktor fotoğrafı
            </legend>
            <div className="mt-4 grid grid-cols-[5.75rem_1fr] items-start gap-4 sm:grid-cols-[7rem_1fr] sm:gap-5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-black/8 bg-black/[.025]">
                <DoctorImage
                  alt="Doktor fotoğrafı önizlemesi"
                  className="object-cover"
                  fill
                  sizes="112px"
                  src={previewUrl}
                />
              </div>
              <div className="min-w-0">
                <label
                  className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-black/10 bg-white px-3.5 text-xs font-medium text-black/72 transition-colors hover:border-black/18 hover:bg-black/[.025] focus-within:ring-2 focus-within:ring-[#516fc9]/20"
                  htmlFor="doctorImage"
                >
                  <UploadSimple aria-hidden="true" className="size-4" weight="light" />
                  {doctor ? "Fotoğrafı değiştir" : "Fotoğraf seç"}
                </label>
                <input
                  accept="image/jpeg,image/png,image/webp"
                  aria-invalid={Boolean(errors.image)}
                  className="sr-only"
                  id="doctorImage"
                  type="file"
                  {...register("image", { onChange: handleImageChange })}
                />
                <p className="mt-3 truncate text-xs font-medium text-black/56">
                  {selectedFileName ||
                    (doctor ? "Mevcut fotoğraf korunacak" : "Henüz dosya seçilmedi")}
                </p>
                <p className="mt-1 text-[0.7rem] leading-5 text-black/38">
                  JPG, PNG veya WebP. En fazla 8 MB, önerilen oran 4:5.
                </p>
                <FieldError>{errors.image?.message}</FieldError>
              </div>
            </div>
          </fieldset>

          <fieldset className="border-t border-black/[.07] pt-6">
            <legend className="text-[0.68rem] font-semibold tracking-[0.12em] text-black/42 uppercase">
              Sıralama ve yayın
            </legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClassName} htmlFor="doctorSortOrder">
                  Görüntüleme sırası
                </label>
                <input
                  aria-invalid={Boolean(errors.sortOrder)}
                  className={inputClassName}
                  id="doctorSortOrder"
                  max="999"
                  min="0"
                  type="number"
                  {...register("sortOrder", { valueAsNumber: true })}
                />
                <FieldError>{errors.sortOrder?.message}</FieldError>
              </div>
              <div>
                <p className={labelClassName}>Yayın durumu</p>
                <label className="mt-2 flex min-h-11 cursor-pointer items-center justify-between rounded-lg border border-black/10 bg-white px-3.5 transition-colors hover:border-black/18">
                  <span className="flex items-center gap-2 text-sm text-black/68">
                    <Check aria-hidden="true" className="size-4 text-[#516fc9]" weight="light" />
                    Sitede göster
                  </span>
                  <input className="peer sr-only" type="checkbox" {...register("isPublished")} />
                  <span className="relative h-5 w-9 rounded-full bg-black/15 transition-colors after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:bg-[#516fc9] peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-[#516fc9]/25" />
                </label>
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      <div className="flex shrink-0 gap-3 border-t border-black/[.07] bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:justify-end sm:px-7">
        <DialogClose className="min-h-10 flex-1 rounded-lg border border-black/10 px-4 text-sm font-medium text-black/68 transition-colors hover:bg-black/[.025] sm:flex-none">
          Vazgeç
        </DialogClose>
        <button
          className="min-h-10 flex-1 rounded-lg bg-[#1f1f1f] px-4 text-sm font-medium text-white transition-colors hover:bg-[#516fc9] disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-40 sm:flex-none"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Kaydediliyor…" : doctor ? "Değişiklikleri kaydet" : "Doktoru ekle"}
        </button>
      </div>
    </form>
  );
}

export default function DoctorFormDialog({
  doctor,
  formRevision,
  nextSortOrder,
  onOpenChange,
  onSubmit,
  open,
}) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="flex flex-col rounded-t-2xl bg-white shadow-[0_-16px_48px_rgba(0,0,0,.08)] sm:rounded-none sm:shadow-[-20px_0_60px_rgba(0,0,0,.1)]"
        variant="sheet"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-black/[.07] px-5 py-4 sm:px-7 sm:py-5">
          <div>
            <DialogTitle className="text-lg font-semibold tracking-[-0.025em] text-black">
              {doctor ? "Doktoru düzenle" : "Doktor ekle"}
            </DialogTitle>
            <DialogDescription className="mt-1 text-xs leading-5 text-black/46">
              Sitede gösterilecek temel doktor bilgilerini düzenleyin.
            </DialogDescription>
          </div>
          <DialogClose
            aria-label="Formu kapat"
            className="grid size-9 shrink-0 place-items-center rounded-lg text-black/46 transition-colors hover:bg-black/[.045] hover:text-black"
          >
            <X aria-hidden="true" className="size-4" weight="light" />
          </DialogClose>
        </div>

        <DoctorForm
          doctor={doctor}
          key={formRevision}
          nextSortOrder={nextSortOrder}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
