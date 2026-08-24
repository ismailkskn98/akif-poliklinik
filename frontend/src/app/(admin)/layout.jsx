import "../globals.css";
import localFont from "next/font/local";

import { Toaster } from "@/components/ui/toast";
import { siteConfig } from "@/config/site";

const geistSans = localFont({
  src: "../../../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  style: "normal",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export const metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: "Admin | Akif Poliklinik",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({ children }) {
  return (
    <html className={geistSans.variable} lang="tr">
      <body className="bg-[#fafafa] text-[#1f1f1f]">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
