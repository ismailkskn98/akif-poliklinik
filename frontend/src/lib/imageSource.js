function getBackendOrigin() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_BACKEND_ORIGIN ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:4000";

  try {
    return new URL(configuredUrl).origin;
  } catch {
    return "http://localhost:4000";
  }
}

export function resolveBackendAssetUrl(source) {
  if (typeof source !== "string" || !source) {
    return "";
  }

  if (source.startsWith("blob:") || source.startsWith("data:")) {
    return source;
  }

  const backendOrigin = getBackendOrigin();

  try {
    const parsedUrl = new URL(source, backendOrigin);

    if (!parsedUrl.pathname.startsWith("/uploads/")) {
      return source;
    }

    return new URL(
      `${parsedUrl.pathname}${parsedUrl.search}`,
      backendOrigin,
    ).toString();
  } catch {
    return source;
  }
}

export function shouldBypassImageOptimization(source) {
  if (typeof source !== "string" || !source) {
    return false;
  }

  if (source.startsWith("blob:")) {
    return true;
  }

  try {
    const { hostname } = new URL(source);

    return ["localhost", "127.0.0.1", "[::1]"].includes(hostname);
  } catch {
    return false;
  }
}
