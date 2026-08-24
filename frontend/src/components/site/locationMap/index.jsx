export default function LocationMap({ title, settings }) {
  return (
    <section data-motion-reveal aria-label={title} className="px-3 pb-3 sm:px-5 sm:pb-5">
      <iframe
        className="mx-auto block h-[18rem] w-full max-w-[76rem] grayscale-[0.25] sm:h-[23rem] lg:h-[27rem]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={settings.mapEmbedUrl}
        title={title}
      />
    </section>
  );
}
