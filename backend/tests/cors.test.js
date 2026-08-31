const assert = require("node:assert/strict");
const { once } = require("node:events");
const test = require("node:test");

process.env.NODE_ENV = "test";
process.env.CORS_ORIGINS =
  "https://akifpoliklinigi.com,https://www.akifpoliklinigi.com";

const {
  createCorsOptions,
  normalizeOrigin,
  parseAllowedOrigins,
} = require("../general_helpers/cors");
const app = require("../app");

test("CORS origin listesini normalize eder ve tekrarları kaldırır", () => {
  assert.deepEqual(
    parseAllowedOrigins(
      " https://AKIFPOLIKLINIGI.com/, https://akifpoliklinigi.com:443 ",
    ),
    ["https://akifpoliklinigi.com"],
  );
});

test("geçersiz veya güvensiz CORS origin değerlerini reddeder", () => {
  const invalidOrigins = [
    "*",
    "invalid-origin",
    "ftp://akifpoliklinigi.com",
    "https://akifpoliklinigi.com/admin",
    "https://user:password@akifpoliklinigi.com",
  ];

  invalidOrigins.forEach((origin) => {
    assert.throws(() => normalizeOrigin(origin));
  });
});

test("Origin başlığı olmayan istekleri kabul eder", () => {
  const options = createCorsOptions(["https://akifpoliklinigi.com"]);

  options.origin(undefined, (error, isAllowed) => {
    assert.equal(error, null);
    assert.equal(isAllowed, true);
  });
});

test("izinli originleri kabul eder, yabancı origini kontrollü 403 ile reddeder", async (context) => {
  const server = app.listen(0);
  await once(server, "listening");

  context.after(
    () =>
      new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  );

  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const loginUrl = `${baseUrl}/api/akifclinic/v1/auth/login`;
  const preflight = (origin) =>
    globalThis.fetch(loginUrl, {
      method: "OPTIONS",
      headers: {
        Origin: origin,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type",
      },
    });

  for (const origin of [
    "https://akifpoliklinigi.com",
    "https://www.akifpoliklinigi.com",
  ]) {
    const response = await preflight(origin);

    assert.equal(response.status, 204);
    assert.equal(response.headers.get("access-control-allow-origin"), origin);
  }

  const originalWarn = console.warn;
  const warnings = [];
  console.warn = (...values) => warnings.push(values.join(" "));

  let deniedResponse;

  try {
    deniedResponse = await preflight("https://foreign.example");
  } finally {
    console.warn = originalWarn;
  }

  assert.equal(deniedResponse.status, 403);
  assert.equal(deniedResponse.headers.get("access-control-allow-origin"), null);
  assert.deepEqual(await deniedResponse.json(), {
    status: false,
    message: "Bu kaynaktan gelen isteğe izin verilmiyor.",
    data: null,
  });
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /origin="https:\/\/foreign\.example"/);
  assert.doesNotMatch(warnings[0], /\n|\sat\s/);

  const healthResponse = await globalThis.fetch(
    `${baseUrl}/api/akifclinic/v1/public/health`,
  );
  assert.equal(healthResponse.status, 200);
});
