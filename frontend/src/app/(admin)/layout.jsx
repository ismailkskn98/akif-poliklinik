import "../globals.css";

export const metadata = {
  title: "Admin | Akif Poliklinik",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="bg-[#fafafa] text-[#1f1f1f]">{children}</body>
    </html>
  );
}
