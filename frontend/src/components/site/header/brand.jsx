import Image from "next/image";

import { siteConfig } from "@/config/site";
import { siteTheme } from "@/config/theme";
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
            ? "w-48 sm:w-[13.5rem] lg:w-56 xl:w-60"
            : "w-32 sm:w-36"
        }`}
        height={468}
        priority
        sizes={
          isDisplay
            ? "(min-width: 1280px) 240px, (min-width: 1024px) 224px, (min-width: 640px) 216px, 192px"
            : "(min-width: 640px) 144px, 128px"
        }
        src={siteTheme.logos.header}
        width={953}
      />
    </Link>
  );
}
