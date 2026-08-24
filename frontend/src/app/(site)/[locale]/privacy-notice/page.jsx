import { getTranslations, setRequestLocale } from "next-intl/server";

import { createPageMetadata } from "@/lib/seo";

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

  return (
    <article data-motion-intro className="grid-container max-w-4xl py-12 sm:py-16">
      <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
        {translations("eyebrow")}
      </p>
      <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
        {translations("title")}
      </h1>
      <p className="mt-5 text-base leading-7 text-black/60">{translations("description")}</p>
      <div className="mt-9 border border-[#27231f]/12 bg-[#f7f5ef] p-6 text-sm leading-7 text-[#27231f]/65 sm:p-8">
        {translations("setupNotice")}
      </div>
    </article>
  );
}
