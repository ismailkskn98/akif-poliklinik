import { ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import JsonLd from "@/components/site/jsonLd";
import { siteConfig } from "@/config/site";
import { getTreatmentCopy } from "@/content/treatmentCopy";
import {
  getTreatmentBySlug,
  getTreatmentHref,
  treatments,
} from "@/content/treatments";
import { getPathname, Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export const dynamicParams = false;

export function generateStaticParams({ params }) {
  return treatments.map((treatment) => ({
    slug: treatment.slugs[params.locale],
  }));
}

function getTreatmentUrl(locale, treatment) {
  return new URL(
    getPathname({ locale, href: getTreatmentHref(treatment, locale) }),
    siteConfig.siteUrl,
  ).toString();
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const treatment = getTreatmentBySlug(locale, slug);

  if (!treatment) {
    return {};
  }

  const content = getTreatmentCopy(locale);
  const [title, description] = content.items[treatment.key];
  const canonical = getTreatmentUrl(locale, treatment);
  const languages = Object.fromEntries(
    routing.locales.map((language) => [
      language,
      getTreatmentUrl(language, treatment),
    ]),
  );

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ...languages,
        "x-default": getTreatmentUrl(routing.defaultLocale, treatment),
      },
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      images: [new URL(treatment.image, siteConfig.siteUrl).toString()],
    },
  };
}

export default async function TreatmentPage({ params }) {
  const { locale, slug } = await params;
  const treatment = getTreatmentBySlug(locale, slug);

  if (!treatment) {
    notFound();
  }

  setRequestLocale(locale);
  const content = getTreatmentCopy(locale);
  const [title, description] = content.items[treatment.key];
  const [categoryTitle] = content.categories[treatment.category];
  const canonical = getTreatmentUrl(locale, treatment);
  const relatedTreatments = treatments
    .filter(
      (candidate) =>
        candidate.category === treatment.category && candidate.key !== treatment.key,
    )
    .slice(0, 3);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalWebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: title,
        description,
        inLanguage: locale,
        image: new URL(treatment.image, siteConfig.siteUrl).toString(),
        about: { "@type": "MedicalProcedure", name: title },
        publisher: { "@id": `${siteConfig.siteUrl}/#clinic` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: content.ui.home,
            item: new URL(
              getPathname({ locale, href: "/" }),
              siteConfig.siteUrl,
            ).toString(),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: content.ui.treatments,
            item: new URL(
              getPathname({ locale, href: "/treatments" }),
              siteConfig.siteUrl,
            ).toString(),
          },
          { "@type": "ListItem", position: 3, name: title, item: canonical },
        ],
      },
    ],
  };

  return (
    <article className="pb-16 sm:pb-20">
      <JsonLd data={schema} />

      <header data-motion-intro className="grid-container pb-9 pt-8 sm:pb-11 sm:pt-12 lg:pt-16">
        <nav aria-label={content.ui.breadcrumb} className="flex flex-wrap items-center gap-2 text-xs text-[#172038]/45">
          <Link href="/" className="hover:text-primary">{content.ui.home}</Link>
          <span aria-hidden="true">/</span>
          <Link href="/treatments" className="hover:text-primary">{content.ui.treatments}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{title}</span>
        </nav>

        <div className="mt-8 grid gap-7 lg:grid-cols-[1.4fr_.6fr] lg:items-end">
          <div>
            <p className="text-[0.68rem] font-semibold tracking-[0.18em] text-primary uppercase">
              {categoryTitle}
            </p>
            <h1 className="mt-4 max-w-5xl text-balance text-[clamp(2.8rem,7vw,6.25rem)] leading-[0.9] font-medium tracking-[-0.068em] text-[#172038]">
              {title}
            </h1>
          </div>
          <p className="border-s border-[#172038]/12 ps-5 text-sm leading-6 text-[#172038]/58">
            {description}
          </p>
        </div>
      </header>

      <div data-motion-intro className="grid-container">
        <div className="overflow-hidden border border-ink/12 bg-media p-1.5 sm:p-2">
          <Image
            alt={title}
            className="aspect-[16/9] w-full object-cover"
            height={941}
            priority
            sizes="(min-width: 1280px) 1216px, 100vw"
            src={treatment.image}
            width={1672}
          />
        </div>
      </div>

      <section data-motion-reveal className="grid-container grid gap-9 py-14 sm:py-20 lg:grid-cols-[.68fr_1.32fr]">
        <div>
          <p className="text-[0.68rem] font-semibold tracking-[0.18em] text-primary uppercase">
            {content.ui.aftercareEyebrow}
          </p>
          <h2 className="mt-4 max-w-md text-balance text-3xl leading-[1.02] font-medium tracking-[-0.045em] sm:text-4xl">
            {content.ui.aftercareTitle}
          </h2>
        </div>

        <ol className="border-t border-[#172038]/12">
          {content.profiles[treatment.profile].map((point, index) => (
            <li
              key={point}
              className="grid grid-cols-[auto_1fr] gap-5 border-b border-[#172038]/12 py-5 sm:gap-7 sm:py-6"
            >
              <span className="grid size-8 place-items-center border border-primary/24 text-primary">
                <Check aria-hidden="true" className="size-4" weight="light" />
              </span>
              <div>
                <span className="text-[0.62rem] font-medium tracking-[0.15em] text-[#172038]/35 uppercase">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#172038]/68 sm:text-base sm:leading-7">
                  {point}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <aside data-motion-reveal className="grid-container">
        <div className="border border-ink/12 bg-media p-1.5">
          <div className="grid gap-6 bg-surface p-6 sm:p-8 lg:grid-cols-[.55fr_1.45fr]">
            <h2 className="text-xl font-medium tracking-[-0.035em]">
              {content.ui.disclaimerTitle}
            </h2>
            <div>
              <p className="text-sm leading-7 text-[#172038]/58">
                {content.ui.disclaimer}
              </p>
              <p className="mt-5 text-xs leading-6 text-[#172038]/42">
                {content.ui.sourceNote}
              </p>
              <a
                href={treatment.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark"
              >
                {content.ui.source}
                <ArrowUpRight aria-hidden="true" className="size-4" weight="light" />
              </a>
            </div>
          </div>
        </div>
      </aside>

      {relatedTreatments.length ? (
        <section data-motion-reveal className="grid-container pt-14 sm:pt-20">
          <h2 className="border-b border-[#172038]/12 pb-4 text-2xl font-medium tracking-[-0.04em]">
            {content.ui.otherTreatments}
          </h2>
          <div className="grid divide-y divide-[#172038]/10">
            {relatedTreatments.map((related) => (
              <Link
                key={related.key}
                href={getTreatmentHref(related, locale)}
                className="group flex items-center justify-between gap-5 py-4 text-lg font-medium tracking-[-0.03em] transition-colors hover:text-primary sm:text-xl"
              >
                {content.items[related.key][0]}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                  weight="light"
                />
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section data-motion-reveal className="grid-container pt-14 sm:pt-20">
        <div className="flex flex-col items-start justify-between gap-7 border border-primary bg-primary px-6 py-7 text-white sm:flex-row sm:items-center sm:px-9 sm:py-8">
          <p className="max-w-2xl text-xl leading-tight font-medium tracking-[-0.035em] sm:text-2xl">
            {content.ui.contactTitle}
          </p>
          <Link
            href={{ pathname: "/", hash: "contact" }}
            className="inline-flex min-h-11 items-center border border-white bg-white px-4 text-sm font-medium text-primary transition-colors duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:bg-transparent hover:text-white"
          >
            {content.ui.contact}
          </Link>
        </div>
      </section>
    </article>
  );
}
