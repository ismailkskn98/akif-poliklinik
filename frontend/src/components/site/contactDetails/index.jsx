import { MapPin, Phone } from "@phosphor-icons/react/dist/ssr";

export default function ContactDetails({ labels, settings, tone = "light" }) {
  const isDark = tone === "dark";

  return (
    <div className="mt-5 sm:mt-6">
      <div
        className={`grid border-t ${
          isDark ? "border-white/14" : "border-ink/12"
        }`}
      >
        {settings.phones.map((phone) => (
          <a
            key={phone.href}
            className={`flex min-h-14 items-center gap-3 border-b px-0 text-[1.05rem] font-medium tracking-[-0.025em] transition-colors duration-180 ease-[cubic-bezier(.22,1,.36,1)] sm:min-h-16 sm:text-[1.12rem] lg:min-h-[3.75rem] lg:text-[1.08rem] xl:text-[1.18rem] ${
              isDark
                ? "border-white/14 text-white/72 hover:text-white"
                : "border-ink/12 text-ink/82 hover:text-primary"
            }`}
            href={phone.href}
          >
            <Phone
              aria-hidden="true"
              className={`size-5 shrink-0 sm:size-[1.35rem] ${isDark ? "text-white/42" : "text-primary"}`}
              weight="regular"
            />
            {phone.label}
          </a>
        ))}
      </div>

      <div
        className={`mt-8 border-t pt-6 sm:mt-10 sm:pt-7 ${
          isDark ? "border-white/14" : "border-ink/12"
        }`}
      >
        <h3
          className={`text-[0.68rem] font-semibold tracking-[0.16em] uppercase ${
            isDark ? "text-white/36" : "text-primary"
          }`}
        >
          {labels.addressTitle}
        </h3>
        <p
          className={`mt-4 flex max-w-xl items-start gap-3 text-base leading-6.5 sm:text-[1.08rem] sm:leading-7 lg:text-base xl:text-[1.06rem] ${
            isDark ? "text-white/64" : "text-ink/68"
          }`}
        >
          <MapPin
            aria-hidden="true"
            className={`mt-0.5 size-5 shrink-0 ${isDark ? "text-white/42" : "text-primary"}`}
            weight="regular"
          />
          {settings.address}
        </p>
      </div>
    </div>
  );
}
