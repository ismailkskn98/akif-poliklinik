const { URL, URLSearchParams } = require("node:url");
const { AbortSignal, fetch } = globalThis;

const allowedGoogleMapsHosts = new Set([
  "google.com",
  "www.google.com",
  "google.com.tr",
  "www.google.com.tr",
  "maps.google.com",
  "maps.app.goo.gl",
  "goo.gl",
]);
const shortLinkHosts = new Set(["maps.app.goo.gl", "goo.gl"]);

function isAllowedGoogleMapsUrl(value) {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();

    if (url.protocol !== "https:" || !allowedGoogleMapsHosts.has(hostname)) {
      return false;
    }

    return (
      shortLinkHosts.has(hostname) ||
      hostname === "maps.google.com" ||
      url.pathname.startsWith("/maps")
    );
  } catch {
    return false;
  }
}

function parseCoordinates(value) {
  const coordinatePatterns = [
    /@(-?\d{1,2}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)/,
    /!3d(-?\d{1,2}(?:\.\d+)?)!4d(-?\d{1,3}(?:\.\d+)?)/,
  ];

  for (const pattern of coordinatePatterns) {
    const match = value.match(pattern);

    if (match) {
      return normalizeCoordinates(match[1], match[2]);
    }
  }

  const url = new URL(value);

  for (const parameterName of ["q", "query", "ll", "destination"]) {
    const parameterValue = url.searchParams.get(parameterName);
    const match = parameterValue?.match(
      /^\s*(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)\s*$/,
    );

    if (match) {
      return normalizeCoordinates(match[1], match[2]);
    }
  }

  return null;
}

function normalizeCoordinates(latitudeValue, longitudeValue) {
  const latitude = Number(latitudeValue);
  const longitude = Number(longitudeValue);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return { latitude, longitude };
}

function parsePlaceName(value) {
  const url = new URL(value);
  const placePathMatch = url.pathname.match(/\/maps\/place\/([^/]+)/i);
  const coordinateValuePattern =
    /^\s*-?\d{1,2}(?:\.\d+)?\s*,\s*-?\d{1,3}(?:\.\d+)?\s*$/;

  if (placePathMatch) {
    return decodeURIComponent(placePathMatch[1].replace(/\+/g, " ")).trim();
  }

  for (const parameterName of ["q", "query", "destination"]) {
    const parameterValue = url.searchParams.get(parameterName)?.trim();

    if (parameterValue && !coordinateValuePattern.test(parameterValue)) {
      return parameterValue;
    }
  }

  return null;
}

function createMapEmbedUrl({ latitude, longitude, placeName }) {
  const coordinates = `${latitude},${longitude}`;
  const parameters = new URLSearchParams({
    q: placeName || coordinates,
    ll: coordinates,
    t: "m",
    z: "17",
    output: "embed",
    iwloc: "A",
  });

  return `https://maps.google.com/maps?${parameters.toString()}`;
}

async function resolveGoogleMapsShareUrl(shareUrl) {
  if (!isAllowedGoogleMapsUrl(shareUrl)) {
    throw new Error("INVALID_GOOGLE_MAPS_URL");
  }

  let resolvedUrl = new URL(shareUrl).toString();

  for (let redirectCount = 0; redirectCount < 5; redirectCount += 1) {
    const currentUrl = new URL(resolvedUrl);

    if (!shortLinkHosts.has(currentUrl.hostname.toLowerCase())) {
      break;
    }

    const response = await fetch(currentUrl, {
      headers: { "User-Agent": "AkifPoliklinik/1.0" },
      redirect: "manual",
      signal: AbortSignal.timeout(7000),
    });
    const location = response.headers.get("location");

    if (!location) {
      throw new Error("GOOGLE_MAPS_REDIRECT_NOT_FOUND");
    }

    const nextUrl = new URL(location, currentUrl);

    if (!isAllowedGoogleMapsUrl(nextUrl.toString())) {
      throw new Error("UNSAFE_GOOGLE_MAPS_REDIRECT");
    }

    resolvedUrl = nextUrl.toString();
  }

  const coordinates = parseCoordinates(resolvedUrl);
  const placeName = parsePlaceName(resolvedUrl);

  if (!coordinates) {
    throw new Error("GOOGLE_MAPS_COORDINATES_NOT_FOUND");
  }

  return {
    mapShareUrl: new URL(shareUrl).toString(),
    mapEmbedUrl: createMapEmbedUrl({ ...coordinates, placeName }),
    coordinates,
    placeName,
  };
}

module.exports = {
  createMapEmbedUrl,
  isAllowedGoogleMapsUrl,
  parseCoordinates,
  parsePlaceName,
  resolveGoogleMapsShareUrl,
};
