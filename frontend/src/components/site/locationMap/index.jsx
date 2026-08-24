import ConsentControlledMap from "./consentControlledMap";

export default function LocationMap({ consentLabels, title, settings }) {
  return (
    <section data-motion-reveal aria-label={title} className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="mx-auto h-[18rem] w-full max-w-[76rem] overflow-hidden sm:h-[23rem] lg:h-[27rem]">
        <ConsentControlledMap
          labels={consentLabels}
          mapEmbedUrl={settings.mapEmbedUrl}
          title={title}
        />
      </div>
    </section>
  );
}
