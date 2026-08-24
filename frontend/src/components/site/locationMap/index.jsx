import { siteConfig } from "@/config/site";

export default function LocationMap({ title }) {
  return (
    <section data-motion-reveal aria-label={title} className="bg-[#ebe6de] px-3 pb-3 sm:px-5 sm:pb-5">
      <iframe
        className="mx-auto block h-[18rem] w-full max-w-[76rem] grayscale-[0.25] sm:h-[23rem] lg:h-[27rem]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={siteConfig.mapEmbedUrl}
        title={title}
      />
    </section>
  );
}
