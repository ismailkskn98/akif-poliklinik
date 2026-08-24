import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.js");
const backendOrigin = new URL(
  process.env.NEXT_PUBLIC_BACKEND_ORIGIN || "http://localhost:4000",
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: backendOrigin.protocol.replace(":", ""),
        hostname: backendOrigin.hostname,
        port: backendOrigin.port,
        pathname: "/uploads/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
