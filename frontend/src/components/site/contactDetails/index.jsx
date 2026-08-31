import { MapPin, Phone } from "@phosphor-icons/react/dist/ssr";

export default function ContactDetails({ labels, settings, tone = "light" }) {
  const isDark = tone === "dark";

  return (
    <div className="mt-5 sm:mt-6">
      <div className="grid gap-1 sm:gap-0">
        {settings.phones.map((phone) => (
          <a
            key={phone.href}
            className={`flex min-h-24 w-fit justify-self-center flex-col items-center justify-center gap-2.5 px-0 text-center text-[1.35rem] font-medium tracking-[-0.025em] transition-colors duration-180 ease-[cubic-bezier(.22,1,.36,1)] sm:min-h-16 sm:justify-self-start sm:flex-row sm:justify-start sm:gap-3 sm:text-start sm:text-[1.12rem] lg:min-h-[3.75rem] lg:text-[1.08rem] xl:text-[1.18rem] ${
              isDark ? "text-white/72 hover:text-white" : "text-ink/82 hover:text-primary"
            }`}
            href={phone.href}
          >
            <span className={`grid size-11 shrink-0 place-items-center rounded-full border sm:size-auto sm:border-0 ${isDark ? "border-white/36" : "border-primary/42"}`}>
              <Phone aria-hidden="true" className={`size-5 sm:size-[1.35rem] ${isDark ? "text-white/62" : "text-primary"}`} weight="regular" />
            </span>
            <span className="whitespace-nowrap">{phone.label}</span>
          </a>
        ))}
      </div>

      <div className={`mt-8 pt-6 sm:mt-10 sm:border-t sm:pt-7 ${isDark ? "border-white/14" : "border-ink/12"}`}>
        <h3 className={`text-center text-xs font-semibold tracking-[0.14em] uppercase sm:text-start ${isDark ? "text-white/60" : "text-primary"}`}>{labels.addressTitle}</h3>
        <p
          className={`mx-auto mt-4 flex max-w-xl flex-col items-center gap-3 text-center text-[1.08rem] leading-7 sm:mx-0 sm:flex-row sm:items-start sm:text-start sm:text-[1.08rem] sm:leading-7 lg:text-base xl:text-[1.06rem] ${
            isDark ? "text-white/64" : "text-ink/68"
          }`}
        >
          <span className={`grid size-11 shrink-0 place-items-center rounded-full border sm:size-auto sm:border-0 ${isDark ? "border-white/36" : "border-primary/42"}`}>
            <MapPin aria-hidden="true" className={`size-5 sm:mt-0.5 ${isDark ? "text-white/62" : "text-primary"}`} weight="regular" />
          </span>
          <span>{settings.address}</span>
        </p>
      </div>
    </div>
  );
}
