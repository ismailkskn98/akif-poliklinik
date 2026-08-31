import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export default async function NotFoundPage() {
  const translations = await getTranslations("NotFound");

  return (
    <section className="grid-container">
      <div className="relative isolate flex items-center justify-center overflow-hidden py-14 sm:py-18 lg:min-h-[calc(100dvh-11rem)] lg:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
          <span
            className="select-none whitespace-nowrap font-semibold"
            style={{
              color: "rgb(81 111 201 / 0.08)",
              fontSize: "clamp(15rem, 52vw, 42rem)",
              letterSpacing: "-0.1em",
              lineHeight: 0.72,
            }}
          >
            404
          </span>
        </div>

        <div data-motion-intro className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{translations("label")}</p>
          <h1 className="mt-5 max-w-xl text-balance text-[clamp(2.25rem,6vw,4.75rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-ink">{translations("title")}</h1>
          <p className="mt-6 max-w-lg text-sm leading-6 text-ink/58 sm:text-base sm:leading-7">{translations("description")}</p>

          <div className="mt-9 flex w-full flex-col items-center gap-4">
            <Link
              href="/"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-primary px-5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark sm:w-auto"
            >
              <ArrowLeft aria-hidden="true" className="size-4 rtl:rotate-180" weight="regular" />
              {translations("home")}
            </Link>
            <Link href="/doctors" className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink transition-colors duration-200 hover:text-primary">
              {translations("doctors")}
              <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" weight="regular" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
