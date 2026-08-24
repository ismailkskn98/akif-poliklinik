import { ArrowUpRight, InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { siteConfig } from "@/config/site";
import { getTreatmentCopy } from "@/content/treatmentCopy";
import { Link } from "@/i18n/navigation";
import { getPublicSiteSettings } from "@/lib/siteSettings";

export default async function Footer({ locale }) {
  const translations = await getTranslations({ locale, namespace: "Footer" });
  const content = getTreatmentCopy(locale);
  const settings = await getPublicSiteSettings();

  return (
    <footer data-motion-reveal className="bg-ink-deep text-[#f7f9ff]">
      <div className="grid-container">
        <div className="flex items-center justify-end border-b border-white/12 py-5 text-[0.65rem] font-semibold tracking-[0.16em] text-white/46 uppercase">
          <a className="group inline-flex items-center gap-2 transition-colors duration-200 hover:text-white" href={settings.instagramUrl} target="_blank" rel="noreferrer">
            <InstagramLogo aria-hidden="true" className="size-3.5" weight="light" />
            Instagram
            <ArrowUpRight aria-hidden="true" className="size-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" weight="light" />
          </a>
        </div>

        <div className="grid gap-10 py-11 sm:py-13 lg:grid-cols-[1.2fr_.8fr] lg:gap-16">
          <div>
            <p className="text-[0.66rem] font-semibold tracking-[0.16em] text-white/42 uppercase">{content.ui.contact}</p>
            <Link
              href="/"
              aria-label={siteConfig.name}
              className="mt-5 inline-flex transition-opacity duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:opacity-72"
            >
              <Image
                alt=""
                className="h-auto w-36 object-contain sm:w-44 lg:w-48"
                height={468}
                sizes="(min-width: 1024px) 192px, (min-width: 640px) 176px, 144px"
                src="/images/logo/akif-wordmark-white.png"
                width={953}
              />
            </Link>
            <address className="mt-6 max-w-md text-[0.82rem] leading-5.5 not-italic text-white/54">{settings.address}</address>
          </div>

          <div className="grid content-start gap-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div>
              <p className="border-b border-white/12 pb-3 text-[0.64rem] font-semibold tracking-[0.14em] text-white/40 uppercase">{content.ui.call}</p>
              <div className="mt-3 grid">
                {settings.phones.map((phone, index) => (
                  <a key={phone.href} href={phone.href} className={`py-1.5 text-sm transition-colors duration-200 hover:text-white ${index === 0 ? "text-white" : "text-white/52"}`}>
                    {phone.label}
                  </a>
                ))}
              </div>
            </div>

            <nav aria-label={translations("legalTitle")}>
              <p className="border-b border-white/12 pb-3 text-[0.64rem] font-semibold tracking-[0.14em] text-white/40 uppercase">{translations("legalTitle")}</p>
              <div className="mt-3 grid text-sm text-white/54">
                <Link className="py-1.5 transition-colors duration-200 hover:text-white" href="/treatments">
                  {content.ui.treatments}
                </Link>
                <Link className="py-1.5 transition-colors duration-200 hover:text-white" href="/privacy-notice">
                  {translations("privacy")}
                </Link>
                <Link className="py-1.5 transition-colors duration-200 hover:text-white" href="/authorization-document">
                  {translations("authorization")}
                </Link>
              </div>
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/12 py-6 text-xs text-white/32 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. {translations("rights")}
          </p>
          <div className="flex flex-col gap-1 sm:items-end">
            <p>{translations("travelAgency")}</p>
            <p>{translations("updatedAt")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
