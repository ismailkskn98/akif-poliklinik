"use client";

import { Check, Cookie, MapPin, X } from "@phosphor-icons/react";
import { useEffect, useState, useSyncExternalStore } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  OPEN_COOKIE_SETTINGS_EVENT,
  getCookieConsentSnapshot,
  getServerCookieConsentSnapshot,
  parseCookieConsent,
  readCookieConsent,
  saveCookieConsent,
  subscribeToCookieConsent,
} from "@/lib/cookieConsent";

const actionClassName =
  "min-h-11 border border-ink/18 bg-transparent px-4 text-center text-xs font-medium text-ink transition-[border-color,color,transform] duration-180 ease-[cubic-bezier(.22,1,.36,1)] hover:border-primary/55 hover:text-primary active:scale-[.99]";

function ConsentOption({ checked, description, disabled = false, onChange, status, title }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-5 border-t border-ink/10 py-5 first:border-t-0">
      <div>
        <h3 className="text-sm font-medium text-ink">{title}</h3>
        <p className="mt-1.5 max-w-xl text-xs leading-5 text-ink/54">{description}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <button
          aria-checked={checked}
          aria-label={title}
          className="relative mt-0.5 h-6 w-11 border border-ink/18 bg-ink/8 transition-colors duration-220 ease-[cubic-bezier(.22,1,.36,1)] aria-checked:border-primary aria-checked:bg-primary disabled:cursor-default disabled:opacity-55"
          disabled={disabled}
          onClick={() => onChange?.(!checked)}
          role="switch"
          type="button"
        >
          <span className="absolute start-0.5 top-0.5 grid size-4.5 translate-x-0 place-items-center bg-white text-primary shadow-[0_2px_8px_rgb(var(--shadow-rgb)_/_0.12)] transition-transform duration-260 ease-[cubic-bezier(.22,.68,.28,1)] rtl:aria-checked:-translate-x-5 ltr:aria-checked:translate-x-5">
            {disabled ? <Check aria-hidden="true" className="size-2.5" weight="bold" /> : null}
          </span>
        </button>
        <span className="text-[0.6rem] font-semibold tracking-[0.1em] text-ink/38 uppercase">
          {status}
        </span>
      </div>
    </div>
  );
}

export default function CookieConsent({ labels }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [externalMedia, setExternalMedia] = useState(false);
  const consentSnapshot = useSyncExternalStore(
    subscribeToCookieConsent,
    getCookieConsentSnapshot,
    getServerCookieConsentSnapshot,
  );
  const storedConsent = parseCookieConsent(consentSnapshot);
  const showBanner = !storedConsent;

  useEffect(() => {
    function showSettings() {
      const currentConsent = readCookieConsent();
      setExternalMedia(currentConsent?.externalMedia ?? false);
      setSettingsOpen(true);
    }

    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, showSettings);

    return () => {
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, showSettings);
    };
  }, []);

  function persistConsent(nextExternalMedia) {
    saveCookieConsent({ externalMedia: nextExternalMedia });
    setExternalMedia(nextExternalMedia);
    setSettingsOpen(false);
  }

  function openSettings() {
    setExternalMedia(storedConsent?.externalMedia ?? false);
    setSettingsOpen(true);
  }

  return (
    <>
      {showBanner ? (
        <section
          aria-labelledby="cookie-consent-title"
          className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/14 bg-surface-overlay px-5 py-5 shadow-[0_-18px_60px_rgb(var(--shadow-rgb)_/_0.08)] sm:inset-x-auto sm:bottom-5 sm:start-5 sm:w-[min(42rem,calc(100vw-2.5rem))] sm:border"
          role="region"
        >
          <div className="flex items-start gap-4">
            <span className="grid size-9 shrink-0 place-items-center border border-primary/22 bg-primary/7 text-primary">
              <Cookie aria-hidden="true" className="size-4" weight="light" />
            </span>
            <div>
              <h2 id="cookie-consent-title" className="text-base font-medium tracking-[-0.025em] text-ink">
                {labels.title}
              </h2>
              <p className="mt-1.5 text-xs leading-5 text-ink/56">{labels.description}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <button className={actionClassName} onClick={() => persistConsent(true)} type="button">
              {labels.acceptAll}
            </button>
            <button className={actionClassName} onClick={() => persistConsent(false)} type="button">
              {labels.rejectOptional}
            </button>
            <button className={actionClassName} onClick={openSettings} type="button">
              {labels.preferences}
            </button>
          </div>
        </section>
      ) : null}

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent variant="responsive" className="flex flex-col bg-surface-overlay sm:max-w-[40rem]">
          <header className="flex shrink-0 items-start justify-between gap-5 border-b border-ink/12 px-5 py-5 sm:px-7 sm:py-6">
            <div>
              <p className="text-[0.62rem] font-semibold tracking-[0.17em] text-primary uppercase">
                {labels.settingsEyebrow}
              </p>
              <DialogTitle className="mt-2 text-xl font-medium tracking-[-0.035em] text-ink sm:text-2xl">
                {labels.settingsTitle}
              </DialogTitle>
              <DialogDescription className="mt-2 max-w-xl text-xs leading-5 text-ink/54">
                {labels.settingsDescription}
              </DialogDescription>
            </div>
            <DialogClose
              aria-label={labels.close}
              className="grid size-10 shrink-0 place-items-center border border-ink/12 text-ink/64 transition-[border-color,color,transform] duration-180 ease-[cubic-bezier(.22,1,.36,1)] hover:border-primary/45 hover:text-primary active:scale-[.97]"
            >
              <X aria-hidden="true" className="size-4" weight="light" />
            </DialogClose>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 sm:px-7">
            <ConsentOption
              checked
              description={labels.necessaryDescription}
              disabled
              status={labels.alwaysActive}
              title={labels.necessaryTitle}
            />
            <ConsentOption
              checked={externalMedia}
              description={labels.externalMediaDescription}
              onChange={setExternalMedia}
              status={externalMedia ? labels.active : labels.inactive}
              title={labels.externalMediaTitle}
            />

            <div className="border-t border-ink/12 py-6">
              <h3 className="text-sm font-medium text-ink">{labels.detailsTitle}</h3>
              <div className="mt-4 grid gap-3">
                <div className="grid grid-cols-[auto_1fr] gap-x-4 border border-ink/10 p-4 text-xs">
                  <Cookie aria-hidden="true" className="mt-0.5 size-4 text-primary" weight="light" />
                  <div>
                    <p className="font-medium text-ink">akif_cookie_consent</p>
                    <p className="mt-1 leading-5 text-ink/54">{labels.consentCookieDescription}</p>
                    <p className="mt-2 text-[0.65rem] text-ink/38">{labels.firstParty} · {labels.sixMonths}</p>
                  </div>
                </div>
                <div className="grid grid-cols-[auto_1fr] gap-x-4 border border-ink/10 p-4 text-xs">
                  <MapPin aria-hidden="true" className="mt-0.5 size-4 text-primary" weight="light" />
                  <div>
                    <p className="font-medium text-ink">Google Maps</p>
                    <p className="mt-1 leading-5 text-ink/54">{labels.mapsCookieDescription}</p>
                    <p className="mt-2 text-[0.65rem] text-ink/38">{labels.thirdParty} · {labels.providerDuration}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid shrink-0 gap-2 border-t border-ink/12 p-4 sm:grid-cols-3 sm:px-7">
            <button className={actionClassName} onClick={() => persistConsent(true)} type="button">
              {labels.acceptAll}
            </button>
            <button className={actionClassName} onClick={() => persistConsent(false)} type="button">
              {labels.rejectOptional}
            </button>
            <button className={actionClassName} onClick={() => persistConsent(externalMedia)} type="button">
              {labels.savePreferences}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
