"use client";

import { MapPin } from "@phosphor-icons/react";
import { useSyncExternalStore } from "react";

import {
  getCookieConsentSnapshot,
  getServerCookieConsentSnapshot,
  parseCookieConsent,
  saveCookieConsent,
  subscribeToCookieConsent,
} from "@/lib/cookieConsent";

export default function ConsentControlledMap({ labels, mapEmbedUrl, title }) {
  const consentSnapshot = useSyncExternalStore(
    subscribeToCookieConsent,
    getCookieConsentSnapshot,
    getServerCookieConsentSnapshot,
  );
  const isAllowed = parseCookieConsent(consentSnapshot)?.externalMedia ?? false;

  function enableMap() {
    saveCookieConsent({ externalMedia: true });
  }

  if (isAllowed) {
    return (
      <iframe
        className="block h-full w-full grayscale-[0.25]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={mapEmbedUrl}
        title={title}
      />
    );
  }

  return (
    <div className="grid h-full place-items-center bg-ink-deep px-6 py-10 text-center text-white">
      <div className="max-w-md">
        <MapPin aria-hidden="true" className="mx-auto size-7 text-primary" weight="light" />
        <h2 className="mt-4 text-2xl font-medium tracking-[-0.035em]">{labels.mapTitle}</h2>
        <p className="mt-2 text-sm leading-6 text-white/62">{labels.mapDescription}</p>
        <button
          className="mt-5 min-h-12 border border-white/20 px-6 text-sm font-medium text-white transition-[border-color,color,transform] duration-180 ease-[cubic-bezier(.22,1,.36,1)] hover:border-primary hover:text-primary active:scale-[.99]"
          onClick={enableMap}
          type="button"
        >
          {labels.enableMap}
        </button>
      </div>
    </div>
  );
}
