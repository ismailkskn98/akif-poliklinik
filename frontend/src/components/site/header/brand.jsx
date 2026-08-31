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
            ? "w-52 sm:w-56 lg:w-60 xl:w-64"
            : "w-36 sm:w-40"
        }`}
        height={468}
        priority
        sizes={
          isDisplay
            ? "(min-width: 1280px) 256px, (min-width: 1024px) 240px, (min-width: 640px) 224px, 208px"
            : "(min-width: 640px) 160px, 144px"
        }
        src={siteTheme.logos.header}
        width={953}
      />
    </Link>
  );
}
