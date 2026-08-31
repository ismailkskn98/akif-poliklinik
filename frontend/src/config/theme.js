const siteThemes = {
  original: {
    colors: {
      background: "#f4f6fd",
      foreground: "#172038",
      ink: "#202943",
      inkDeep: "#252d46",
      media: "#e6ebf6",
      primary: "#516fc9",
      primaryDark: "#405db0",
      primaryForeground: "#ffffff",
      shadowRgb: "23 32 56",
      surface: "#fafbfe",
      surfaceOverlay: "#f8f9fd",
      surfaceSoft: "#eef2fa",
    },
    logos: {
      footer: "/images/logo/akif-wordmark-white.png",
      header: "/images/logo/akif-wordmark-primary.png",
      structuredData: "/images/logo/main-logo.png",
    },
  },
  monochrome: {
    colors: {
      background: "#ffffff",
      foreground: "#000000",
      ink: "#000000",
      inkDeep: "#000000",
      media: "#eeeeee",
      primary: "#000000",
      primaryDark: "#242424",
      primaryForeground: "#ffffff",
      shadowRgb: "0 0 0",
      surface: "#ffffff",
      surfaceOverlay: "#ffffff",
      surfaceSoft: "#f5f5f5",
    },
    logos: {
      footer: "/images/logo/akif-wordmark-white.png",
      header: "/images/logo/akif-wordmark-black.png",
      structuredData: "/images/logo/akif-wordmark-black.png",
    },
  },
};

const defaultThemeName = "monochrome";
const requestedThemeName = process.env.NEXT_PUBLIC_SITE_THEME;

export const activeSiteThemeName = Object.hasOwn(siteThemes, requestedThemeName)
  ? requestedThemeName
  : defaultThemeName;

const activeTheme = siteThemes[activeSiteThemeName];

export const siteTheme = {
  ...activeTheme,
  name: activeSiteThemeName,
  style: {
    "--background": activeTheme.colors.background,
    "--foreground": activeTheme.colors.foreground,
    "--ink": activeTheme.colors.ink,
    "--ink-deep": activeTheme.colors.inkDeep,
    "--media": activeTheme.colors.media,
    "--primary": activeTheme.colors.primary,
    "--primary-dark": activeTheme.colors.primaryDark,
    "--primary-foreground": activeTheme.colors.primaryForeground,
    "--ring": activeTheme.colors.primary,
    "--shadow-rgb": activeTheme.colors.shadowRgb,
    "--surface": activeTheme.colors.surface,
    "--surface-overlay": activeTheme.colors.surfaceOverlay,
    "--surface-soft": activeTheme.colors.surfaceSoft,
  },
};
