import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import ContactDetails from "@/components/site/contactDetails";
import ContactForm from "@/components/site/contactForm";
import { siteConfig } from "@/config/site";
import { getTreatmentCopy } from "@/content/treatmentCopy";
import { Link } from "@/i18n/navigation";

export default function Contact({ translations, locale }) {
  const content = getTreatmentCopy(locale);

  return (
    <section id="contact" className="bg-[#ebe6de] px-3 pb-3 pt-3 sm:px-5 sm:pb-5 sm:pt-5">
      <div className="mx-auto max-w-[76rem] border border-[#27231f]/14 bg-[#faf8f3]">
        <header data-motion-intro className="flex min-h-12 items-center border-b border-[#27231f]/12 px-5 sm:px-7">
          <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-[#27231f]/46 uppercase">
            {siteConfig.name}
          </p>
        </header>

        <div className="grid lg:grid-cols-[.92fr_1.08fr]">
          <div
            data-motion-intro
            className="flex flex-col bg-[#37332e] p-6 text-white sm:p-8 lg:p-10 xl:p-12"
          >
            <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-white/40 uppercase">
              01 · {content.ui.contactEyebrow}
            </p>
            <h1 className="mt-7 max-w-xl text-balance text-[clamp(2.5rem,4.8vw,4.35rem)] leading-[0.94] font-medium tracking-[-0.06em]">
              {content.ui.contactTitle}
            </h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/52">
              {content.ui.homeIntro}
            </p>

            <div className="mt-9 lg:mt-12">
              <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-white/36 uppercase">
                {translations.callTitle}
              </p>
              <ContactDetails
                labels={{ addressTitle: translations.addressTitle }}
                tone="dark"
              />
              <Link
                href="/treatments"
                className="group mt-7 flex min-h-11 items-center justify-between border-t border-white/16 pt-4 text-[0.82rem] text-white/62 transition-colors duration-180 ease-[cubic-bezier(.22,1,.36,1)] hover:text-white"
              >
                <span>{content.ui.treatmentsTeaser}</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 shrink-0 transition-transform duration-200 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  weight="light"
                />
              </Link>
            </div>
          </div>

          <div
            data-motion-intro
            className="flex flex-col border-t border-[#27231f]/12 p-6 sm:p-8 lg:border-s lg:border-t-0 lg:p-10 xl:p-12"
          >
            <div className="border-b border-[#27231f]/12 pb-4">
              <div>
                <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-primary uppercase">
                  02 · {translations.writeTitle}
                </p>
                <h2 className="mt-3 max-w-xl text-[1.65rem] leading-[1.04] font-medium tracking-[-0.04em] text-[#27231f] sm:text-[2.15rem]">
                  {content.ui.homeIntro}
                </h2>
              </div>
            </div>
            <div className="mt-7 lg:mt-9">
              <ContactForm labels={translations.form} locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
