"use client";

import { CaretDown, Check, GlobeHemisphereWest } from "@phosphor-icons/react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { localeLabels } from "@/config/site";
import { getTreatmentByAnySlug, getTreatmentHref } from "@/content/treatments";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LanguageMenu({
  currentLocale,
  label,
  align = "end",
  variant = "default",
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const currentTreatment = params?.slug
    ? getTreatmentByAnySlug(String(params.slug))
    : null;

  function getHref(locale) {
    if (currentTreatment) {
      return getTreatmentHref(currentTreatment, locale);
    }

    return pathname;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={`group flex min-h-10 items-center gap-2 text-[0.68rem] font-medium tracking-[0.08em] text-ink/62 uppercase transition-colors duration-180 ease-[cubic-bezier(.22,1,.36,1)] hover:text-ink data-[popup-open]:text-primary ${
          variant === "mobile"
            ? "h-11 px-0"
            : "h-full border-s border-ink/12 px-3"
        }`}
      >
        <GlobeHemisphereWest aria-hidden="true" className="size-4" weight="light" />
        <span>{currentLocale}</span>
        <CaretDown
          aria-hidden="true"
          className="size-3 transition-transform duration-250 ease-[cubic-bezier(.22,1,.36,1)] group-data-[popup-open]:rotate-180"
          weight="light"
        />
        <span className="sr-only">{label}</span>
      </PopoverTrigger>

      <PopoverContent
        align={align}
        className="w-[min(22rem,calc(100vw-2rem))] p-0"
      >
        <div className="flex items-center justify-between border-b border-ink/12 px-5 py-4">
          <p className="text-[0.66rem] font-semibold tracking-[0.16em] text-ink/48 uppercase">
            {label}
          </p>
          <span className="text-[0.62rem] tracking-[0.12em] text-primary uppercase">
            {currentLocale}
          </span>
        </div>
        <div className="grid grid-cols-2 p-2">
          {routing.locales.map((locale) => (
            <Link
              key={locale}
              href={getHref(locale)}
              locale={locale}
              hrefLang={locale}
              aria-current={locale === currentLocale ? "page" : undefined}
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center justify-between border-b border-transparent px-3 text-sm text-ink/62 transition-colors duration-180 ease-[cubic-bezier(.22,1,.36,1)] hover:border-primary/40 hover:text-ink aria-[current=page]:border-primary aria-[current=page]:text-primary"
            >
              <span>{localeLabels[locale]}</span>
              {locale === currentLocale ? (
                <Check aria-hidden="true" className="size-3.5" weight="light" />
              ) : null}
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
