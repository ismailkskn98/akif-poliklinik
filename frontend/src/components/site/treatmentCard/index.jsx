import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

import { Link } from "@/i18n/navigation";

export default function TreatmentCard({
  treatment,
  locale,
  title,
  summary,
  action,
  index,
}) {
  return (
    <article
      className={`group ${index % 3 === 0 ? "md:col-span-7" : "md:col-span-5"}`}
    >
      <Link href={{ pathname: "/treatments/[slug]", params: { slug: treatment.slugs[locale] } }}>
        <div className="overflow-hidden border border-[#27231f]/12 bg-[#e9e6df] p-1.5">
          <Image
            alt={title}
            className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.018]"
            height={941}
            sizes="(min-width: 768px) 56vw, 100vw"
            src={treatment.image}
            width={1672}
          />
        </div>
        <div className="grid grid-cols-[auto_1fr_auto] gap-4 py-4">
          <span className="pt-1 text-[0.65rem] font-medium text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="text-lg font-medium tracking-[-0.03em] text-[#172038] sm:text-xl">
              {title}
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#172038]/52">
              {summary}
            </p>
            <span className="mt-3 inline-flex text-xs font-medium text-primary">
              {action}
            </span>
          </div>
          <span className="grid size-9 place-items-center border border-[#27231f]/14 transition-colors duration-200 ease-[cubic-bezier(.22,1,.36,1)] group-hover:border-primary group-hover:bg-primary group-hover:text-white">
            <ArrowUpRight aria-hidden="true" className="size-4" weight="light" />
          </span>
        </div>
      </Link>
    </article>
  );
}
