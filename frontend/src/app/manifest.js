import { siteConfig } from "@/config/site";
import { siteTheme } from "@/config/theme";

export default function manifest() {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description:
      "Akif Poliklinik sağlık ve estetik hizmetleri, tedavi bilgileri ve iletişim kanalları.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: siteTheme.colors.background,
    theme_color: siteTheme.colors.primary,
    lang: "tr",
    categories: ["health", "medical"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
