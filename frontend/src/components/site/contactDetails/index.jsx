import { MapPin, Phone } from "@phosphor-icons/react/dist/ssr";

export default function ContactDetails({ labels, settings, tone = "light" }) {
  const isDark = tone === "dark";

  return (
    <div className="mt-4">
      <div
        className={`grid border-t text-[0.9rem] sm:grid-cols-2 ${
          isDark ? "border-white/14" : "border-ink/12"
        }`}
      >
        {settings.phones.map((phone) => (
          <a
            key={phone.href}
            className={`flex min-h-11 items-center gap-2.5 border-b px-0 font-medium tracking-[-0.02em] transition-colors duration-180 ease-[cubic-bezier(.22,1,.36,1)] sm:odd:pe-4 sm:even:border-s sm:even:ps-4 ${
              isDark
                ? "border-white/14 text-white/72 hover:text-white"
                : "border-ink/12 text-ink/72 hover:text-primary"
            }`}
            href={phone.href}
          >
            <Phone
              aria-hidden="true"
              className={`size-4 shrink-0 ${isDark ? "text-white/36" : "text-primary"}`}
              weight="light"
            />
            {phone.label}
          </a>
        ))}
      </div>

      <div
        className={`mt-6 border-t pt-5 ${
          isDark ? "border-white/14" : "border-ink/12"
        }`}
      >
        <h3
          className={`text-[0.65rem] font-semibold tracking-[0.16em] uppercase ${
            isDark ? "text-white/36" : "text-primary"
          }`}
        >
          {labels.addressTitle}
        </h3>
        <p
          className={`mt-3 flex max-w-lg items-start gap-2.5 text-[0.82rem] leading-5.5 ${
            isDark ? "text-white/58" : "text-ink/58"
          }`}
        >
          <MapPin
            aria-hidden="true"
            className={`mt-0.5 size-4 shrink-0 ${isDark ? "text-white/36" : "text-primary"}`}
            weight="light"
          />
          {settings.address}
        </p>
      </div>
    </div>
  );
}
