import ContactDetails from "@/components/site/contactDetails";
import ContactForm from "@/components/site/contactForm";
import { getTreatmentCopy } from "@/content/treatmentCopy";

export default function Contact({ translations, locale, privacyNotice, settings }) {
  const content = getTreatmentCopy(locale);

  return (
    <section id="contact" className="grid-container py-10 sm:py-14 lg:py-16 xl:py-18">
      <div className="grid gap-6 sm:gap-8 md:gap-10 lg:grid-cols-[.88fr_1.11fr] lg:gap-0">
        <div data-motion-intro className="lg:pe-14 xl:pe-18">
          <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-primary uppercase">
            {content.ui.contactEyebrow}
          </p>
          <h1 className="mt-5 max-w-2xl text-balance text-[clamp(2.25rem,4.1vw,3.8rem)] leading-[0.96] font-medium tracking-[-0.055em] text-ink">{content.ui.contactTitle}</h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-ink/54">{content.ui.homeIntro}</p>

          <div className="mt-9 sm:mt-11 lg:mt-12">
            <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-ink/46 uppercase">{translations.callTitle}</p>
            <ContactDetails labels={{ addressTitle: translations.addressTitle }} settings={settings} />
          </div>
        </div>

        <div data-motion-intro className="border-t border-ink/12 pt-6 sm:pt-8 md:pt-10 lg:border-s lg:border-t-0 lg:ps-14 lg:pt-0 xl:ps-18">
          <div className="border-b border-ink/12 pb-5">
            <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-primary uppercase">
              {translations.writeTitle}
            </p>
            <h2 className="mt-3 max-w-xl text-[clamp(1.55rem,2.7vw,2rem)] leading-[1.08] font-medium tracking-[-0.04em] text-ink">{content.ui.homeIntro}</h2>
          </div>
          <div className="mt-7 lg:mt-8">
            <ContactForm labels={translations.form} locale={locale} privacyNotice={privacyNotice} />
          </div>
        </div>
      </div>
    </section>
  );
}
