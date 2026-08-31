import { setRequestLocale } from "next-intl/server";

import TreatmentCard from "@/components/site/treatmentCard";
import { getTreatmentCopy } from "@/content/treatmentCopy";
import {
  getTreatmentsByCategory,
  treatmentCategories,
} from "@/content/treatments";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const content = getTreatmentCopy(locale);

  return createPageMetadata({
    locale,
    pathname: "/treatments",
    title: content.ui.treatments,
    description: content.ui.treatmentsIntro,
  });
}

export default async function TreatmentsPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = getTreatmentCopy(locale);

  return (
    <div className="pb-16 sm:pb-20">
      <header data-motion-intro className="grid-container grid gap-6 pb-12 pt-10 sm:pb-16 sm:pt-14 lg:grid-cols-[.45fr_1.55fr] lg:pt-18">
        <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
          {content.ui.treatmentsEyebrow}
        </p>
        <div>
          <h1 className="max-w-5xl text-balance text-[clamp(2.75rem,6vw,5.4rem)] leading-[0.93] font-medium tracking-[-0.064em] text-ink">
            {content.ui.treatmentsTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-ink/60">
            {content.ui.treatmentsIntro}
          </p>
        </div>
      </header>

      <div className="grid-container grid gap-16 sm:gap-22">
        {treatmentCategories.map((category) => {
          const [title, description] = content.categories[category];
          const items = getTreatmentsByCategory(category);

          return (
            <section data-motion-reveal key={category} aria-labelledby={`category-${category}`}>
              <header className="grid gap-3 border-t border-ink/12 pb-7 pt-4 sm:grid-cols-[.8fr_1.2fr]">
                <h2
                  id={`category-${category}`}
                  className="text-xl font-medium tracking-[-0.035em] text-ink"
                >
                  {title}
                </h2>
                <p className="max-w-xl text-base leading-7 text-ink/58">
                  {description}
                </p>
              </header>

              <div className="grid gap-x-7 gap-y-9 md:grid-cols-12">
                {items.map((treatment, index) => (
                  <TreatmentCard
                    key={treatment.key}
                    action={content.ui.viewTreatment}
                    index={index}
                    locale={locale}
                    summary={content.items[treatment.key][1]}
                    title={content.items[treatment.key][0]}
                    treatment={treatment}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
