export const adminSessionKey = "akif-poliklinik-admin-session";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:4000/api/akifclinic/v1";

export async function adminApiRequest(pathname, { token, body, method = "GET" } = {}) {
  const headers = { "Accept-Language": "tr" };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${apiBaseUrl}${pathname}`, {
    method,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.status) {
    const error = new Error(payload?.message || "İşlem tamamlanamadı.");
    error.status = response.status;
    throw error;
  }

  return payload.data;
}
