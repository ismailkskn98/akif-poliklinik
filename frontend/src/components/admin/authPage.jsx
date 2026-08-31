import Image from "next/image";

export default function AuthPage({ children, description, title }) {
  return (
    <main className="relative grid min-h-[100dvh] overflow-hidden bg-[#f7f9fe] px-4 py-8 sm:px-6 sm:py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(81,111,201,.075)_1px,transparent_1px),linear-gradient(to_bottom,rgba(81,111,201,.075)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_68%_at_50%_42%,black_18%,transparent_82%)]" />
        <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_55%_48%_at_50%_0%,rgba(81,111,201,.18),transparent_72%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/65 to-transparent" />
      </div>

      <section className="relative z-10 my-auto w-full max-w-[27rem] justify-self-center">
        <div className="rounded-2xl border border-[#172038]/10 bg-white/94 p-6 shadow-[0_24px_70px_rgba(44,62,118,.1)] backdrop-blur-[2px] sm:p-8 supports-[not(backdrop-filter:blur(1px))]:bg-white">
          <Image
            alt="Akif Poliklinik"
            className="mx-auto h-auto w-[7.75rem] object-contain sm:w-[8.5rem]"
            height={468}
            priority
            sizes="(min-width: 640px) 136px, 124px"
            src="/images/logo/akif-wordmark-primary.png"
            width={953}
          />

          <div className="mt-6 border-t border-[#172038]/8 pt-6 text-center">
            <h1 className="text-[1.65rem] leading-tight font-semibold tracking-[-0.035em] text-[#172038] sm:text-[1.8rem]">{title}</h1>
            <p className="mx-auto mt-2 max-w-[34ch] text-sm leading-6 text-[#172038]/54">{description}</p>
          </div>

          {children}
        </div>

        <p className="mt-5 text-center text-[0.68rem] text-[#172038]/38">Akif Poliklinik yönetim paneli</p>
      </section>
    </main>
  );
}
