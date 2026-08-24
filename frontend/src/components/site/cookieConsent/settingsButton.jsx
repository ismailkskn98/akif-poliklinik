"use client";

import { SlidersHorizontal } from "@phosphor-icons/react";

import { openCookieSettings } from "@/lib/cookieConsent";

export default function CookieSettingsButton({ label }) {
  return (
    <button
      className="inline-flex items-center gap-2 py-1.5 text-start transition-colors duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:text-white"
      onClick={openCookieSettings}
      type="button"
    >
      <SlidersHorizontal aria-hidden="true" className="size-3.5" weight="light" />
      {label}
    </button>
  );
}
