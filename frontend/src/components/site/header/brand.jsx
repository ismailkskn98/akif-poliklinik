import Image from "next/image";

import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";

export default function Brand({ variant = "compact" }) {
  const isDisplay = variant === "display";

  return (
    <Link
      href="/"
      aria-label={siteConfig.name}
      className={
        isDisplay
          ? "group block"
          : "group flex items-center gap-2.5 text-[0.82rem] font-medium tracking-[-0.025em] text-[#27231f]"
      }
    >
      <Image
        alt=""
        className={`object-cover transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-0.5 ${
          isDisplay ? "size-22 xl:size-24" : "size-9"
        }`}
        height={isDisplay ? 96 : 36}
        priority
        sizes={isDisplay ? "96px" : "36px"}
        src="/images/logo/main-logo.png"
        width={isDisplay ? 96 : 36}
      />
      {isDisplay ? null : <span>{siteConfig.name}</span>}
    </Link>
  );
}
