import Image from "next/image";

import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";

export default function Brand({ variant = "compact" }) {
  const isDisplay = variant === "display";

  return (
    <Link
      href="/"
      aria-label={siteConfig.name}
      className="group inline-flex items-center"
    >
      <Image
        alt=""
        className={`h-auto object-contain transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-0.5 ${
          isDisplay
            ? "w-[10.5rem] sm:w-48 xl:w-[13.5rem]"
            : "w-[6.5rem] sm:w-[7.5rem]"
        }`}
        height={468}
        priority
        sizes={isDisplay ? "(min-width: 1280px) 216px, 192px" : "136px"}
        src="/images/logo/akif-wordmark-primary.png"
        width={953}
      />
    </Link>
  );
}
