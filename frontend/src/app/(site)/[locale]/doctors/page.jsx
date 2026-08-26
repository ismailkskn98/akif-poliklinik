import { getTranslations, setRequestLocale } from "next-intl/server";

import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;

  return createPageMetadata({
    locale,
    pathname: "/doctors",
    titleKey: "doctors.title",
    descriptionKey: "doctors.description",
  });
}

export default async function DoctorsPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const translations = await getTranslations({
    locale,
    namespace: "Pages.doctors",
  });

  return (
    <article data-motion-intro className="grid-container min-h-[34rem] py-12 sm:py-16 lg:py-20">
      <div className="max-w-3xl border-b border-ink/12 pb-10 sm:pb-12">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          {translations("eyebrow")}
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl">
          {translations("title")}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-ink/58">
          {translations("description")}
        </p>
      </div>
    </article>
  );
}
