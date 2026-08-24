import { getTranslations, setRequestLocale } from "next-intl/server";

import { getPrivacyNotice } from "@/content/privacyNotice";
import { createPageMetadata } from "@/lib/seo";
import { getPublicSiteSettings } from "@/lib/siteSettings";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return createPageMetadata({
    locale,
    pathname: "/privacy-notice",
    titleKey: "privacy.title",
    descriptionKey: "privacy.description",
  });
}

export default async function PrivacyNoticePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const translations = await getTranslations({ locale, namespace: "Pages.privacy" });
  const notice = getPrivacyNotice(locale);
  const settings = await getPublicSiteSettings();

  return (
    <article className="bg-surface py-10 sm:py-14">
      <div className="grid-container max-w-5xl">
        <header data-motion-intro className="border-b border-ink/14 pb-8 sm:pb-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              {translations("eyebrow")}
            </p>
            <p className="text-xs text-ink/44">{notice.effectiveDate}</p>
          </div>
          <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
            {translations("title")}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-ink/62">
            {notice.intro}
          </p>
          <dl className="mt-7 grid max-w-xl grid-cols-[auto_1fr] gap-x-4 border-t border-ink/12 pt-4 text-sm">
            <dt className="text-ink/46">{notice.controllerLabel}</dt>
            <dd className="font-medium text-ink">{notice.controllerName}</dd>
          </dl>
        </header>

        <div className="divide-y divide-ink/12">
          {notice.sections.map((section, index) => (
            <section
              data-motion-reveal
              className="grid gap-5 py-8 sm:grid-cols-[2.2rem_15rem_1fr] sm:gap-6 sm:py-10"
              key={section.title}
            >
              <p className="text-xs font-semibold text-primary">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="text-xl font-medium tracking-[-0.025em] text-ink">
                {section.title}
              </h2>
              <div className="grid gap-4 text-sm leading-6.5 text-ink/64">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.items ? (
                  <ul className="grid gap-2.5 border-s border-primary/35 ps-5">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}
        </div>

        <section
          data-motion-reveal
          className="grid gap-6 border-t border-ink/14 bg-ink-deep p-6 text-white sm:p-8 lg:grid-cols-[.72fr_1.28fr] lg:p-10"
        >
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-white/42 uppercase">
              {String(notice.sections.length + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-4 text-2xl font-medium tracking-[-0.035em]">
              {notice.application.title}
            </h2>
          </div>
          <div className="grid gap-4 text-sm leading-6.5 text-white/64">
            {notice.application.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <address className="mt-2 border-t border-white/14 pt-4 not-italic">
              <span className="block text-xs font-semibold tracking-[0.12em] text-white/38 uppercase">
                {notice.application.addressLabel}
              </span>
              <span className="mt-2 block text-white/78">{settings.address}</span>
            </address>
          </div>
        </section>

        <p className="mt-5 text-xs leading-5 text-ink/42">
          {notice.translationNotice}
        </p>
      </div>
    </article>
  );
}
