import { getTranslations, setRequestLocale } from "next-intl/server";

import DoctorImage from "@/components/doctorImage";
import { getPublicDoctors } from "@/lib/doctors";
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
  const doctors = await getPublicDoctors(locale);

  return (
    <article className="grid-container min-h-[34rem] py-12 sm:py-16 lg:py-20">
      <header data-motion-intro className="max-w-3xl border-b border-ink/12 pb-9 sm:pb-11">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          {translations("eyebrow")}
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl">
          {translations("title")}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-ink/58">
          {translations("description")}
        </p>
      </header>

      {doctors.length ? (
        <section
          aria-label={translations("title")}
          className="-mx-2 mt-10 flex flex-wrap justify-center gap-y-9 sm:-mx-3 sm:mt-12 sm:gap-y-14 lg:mt-16"
        >
          {doctors.map((doctor, index) => (
            <figure
              className="group w-full max-w-[28rem] px-2 sm:w-1/2 sm:max-w-none sm:px-3 xl:w-1/3"
              data-motion-reveal
              key={doctor.id}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-ink/[.035]">
                <DoctorImage
                  alt={`${doctor.title} ${doctor.fullName}, Akif Poliklinik`}
                  className="object-cover object-center transition-transform duration-500 ease-[cubic-bezier(.22,.68,.28,1)] motion-safe:group-hover:scale-[1.018]"
                  fill
                  priority={index < 2}
                  sizes="(max-width: 479px) calc(100vw - 2.5rem), (max-width: 639px) 28rem, (max-width: 1279px) 50vw, 33vw"
                  src={doctor.imageUrl}
                />
              </div>
              <figcaption className="border-b border-ink/12 py-4 sm:py-6">
                <p className="text-base font-bold tracking-[0.1em] text-primary uppercase sm:text-[1.05rem] sm:tracking-[0.12em]">
                  {doctor.title}
                </p>
                <h2 className="mt-2 text-2xl leading-snug font-semibold tracking-[-0.025em] text-ink sm:mt-2.5 sm:text-[1.65rem]">
                  {doctor.fullName}
                </h2>
              </figcaption>
            </figure>
          ))}
        </section>
      ) : (
        <p data-motion-intro className="mt-10 max-w-xl text-sm leading-6 text-ink/55">
          {translations("empty")}
        </p>
      )}
    </article>
  );
}
