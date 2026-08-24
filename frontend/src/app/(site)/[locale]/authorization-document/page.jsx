import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { createPageMetadata } from "@/lib/seo";
import { getPublicSiteSettings } from "@/lib/siteSettings";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return createPageMetadata({
    locale,
    pathname: "/authorization-document",
    titleKey: "authorization.title",
    descriptionKey: "authorization.description",
  });
}

export default async function AuthorizationDocumentPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const translations = await getTranslations({
    locale,
    namespace: "Pages.authorization",
  });
  const settings = await getPublicSiteSettings();

  return (
    <article data-motion-intro className="grid-container max-w-5xl py-12 sm:py-16">
      <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
        {translations("eyebrow")}
      </p>
      <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
        {translations("title")}
      </h1>
      <p className="mt-5 max-w-3xl text-base leading-7 text-black/60">
        {translations("description")}
      </p>
      <a
        className="mt-8 inline-flex min-h-11 items-center border border-primary bg-primary px-5 text-sm font-semibold text-white transition-colors duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:bg-transparent hover:text-primary"
        href={settings.authorizationDocumentUrl}
        target="_blank"
        rel="noreferrer"
      >
        {translations("openDocument")}
      </a>
      <div className="mt-8 overflow-hidden border border-ink/12 bg-media p-2">
        <Image
          alt={translations("imageAlt")}
          className="h-auto w-full"
          height={1126}
          priority
          src={settings.authorizationDocumentUrl}
          width={1500}
        />
      </div>
    </article>
  );
}
