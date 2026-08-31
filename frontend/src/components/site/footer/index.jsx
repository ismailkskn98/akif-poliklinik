import { ArrowUpRight, InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import CookieSettingsButton from "@/components/site/cookieConsent/settingsButton";
import { siteConfig } from "@/config/site";
import { siteTheme } from "@/config/theme";
import { getTreatmentCopy } from "@/content/treatmentCopy";
import { Link } from "@/i18n/navigation";
import { getPublicSiteSettings } from "@/lib/siteSettings";

export default async function Footer({ locale }) {
  const translations = await getTranslations({ locale, namespace: "Footer" });
  const content = getTreatmentCopy(locale);
  const settings = await getPublicSiteSettings();

  return (
    <footer data-motion-reveal className="bg-ink-deep text-white">
      <div className="grid-container">
        <div className="flex items-center justify-end border-b border-white/12 py-5 text-xs font-semibold tracking-[0.14em] text-white/52 uppercase">
          <a className="group inline-flex items-center gap-2 transition-colors duration-200 hover:text-white" href={settings.instagramUrl} target="_blank" rel="noreferrer">
            <InstagramLogo aria-hidden="true" className="size-3.5" weight="light" />
            Instagram
            <ArrowUpRight aria-hidden="true" className="size-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" weight="light" />
          </a>
        </div>

        <div className="grid gap-10 py-11 sm:py-13 lg:grid-cols-[1.2fr_.8fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-white/62 uppercase">{content.ui.contact}</p>
            <Link
              href="/"
              aria-label={siteConfig.name}
              className="mt-5 inline-flex transition-opacity duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:opacity-72"
            >
              <Image
                alt=""
                className="h-auto w-40 object-contain sm:w-48 lg:w-52"
                height={468}
                sizes="(min-width: 1024px) 208px, (min-width: 640px) 192px, 160px"
                src={siteTheme.logos.footer}
                width={953}
              />
            </Link>
            <address className="mt-6 max-w-md text-sm leading-6 not-italic text-white/60">{settings.address}</address>
          </div>

          <div className="grid content-start gap-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div>
              <p className="border-b border-white/12 pb-3 text-xs font-semibold tracking-[0.12em] text-white/62 uppercase">{content.ui.call}</p>
              <div className="mt-3 grid">
                {settings.phones.map((phone, index) => (
                  <a key={phone.href} href={phone.href} className={`py-1.5 text-sm transition-colors duration-200 hover:text-white ${index === 0 ? "text-white" : "text-white/52"}`}>
                    {phone.label}
                  </a>
                ))}
              </div>
            </div>

            <nav aria-label={translations("legalTitle")}>
              <p className="border-b border-white/12 pb-3 text-xs font-semibold tracking-[0.12em] text-white/62 uppercase">{translations("legalTitle")}</p>
              <div className="mt-3 grid text-sm text-white/54">
                <Link className="py-1.5 transition-colors duration-200 hover:text-white" href="/doctors">
                  {translations("doctors")}
                </Link>
                <Link className="py-1.5 transition-colors duration-200 hover:text-white" href="/privacy-notice">
                  {translations("privacy")}
                </Link>
                {settings.authorizationDocumentUrl ? (
                  <Link className="py-1.5 transition-colors duration-200 hover:text-white" href="/authorization-document">
                    {translations("authorization")}
                  </Link>
                ) : null}
                <CookieSettingsButton label={translations("cookieSettings")} />
              </div>
            </nav>

            <div className="flex min-h-[6.25rem] items-center justify-between gap-5 bg-white px-4 py-3 text-ink sm:col-span-2 sm:px-5 lg:col-span-1 xl:col-span-2">
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
                  {translations("healthTourism")}
                </p>
                <p className="mt-2 text-sm font-medium tracking-[-0.015em] text-ink/68">
                  {siteConfig.name}
                </p>
              </div>
              <div className="relative h-[4.25rem] w-[7.25rem] shrink-0 overflow-hidden bg-white">
                <Image
                  alt="Health Türkiye"
                  className="absolute start-[-0.3rem] top-[-1.45rem] h-auto w-[7.95rem] max-w-none"
                  height={1080}
                  sizes="127px"
                  src="/images/health-türkiye.jpeg"
                  width={1080}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/12 py-6 text-sm text-white/58 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. {translations("rights")}
          </p>
          <p>{translations("updatedAt")}</p>
        </div>
      </div>
    </footer>
  );
}
