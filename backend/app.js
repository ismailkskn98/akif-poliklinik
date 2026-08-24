const express = require("express");
const cors = require("cors");

const loadEnvironment = require("./general_helpers/loadEnvironment");

loadEnvironment();

const { sendError } = require("./general_helpers/response");
const { i18nMiddleware } = require("./general_services/i18n");
const apiRouter = require("./akifClinic/v1");
const errorHandler = require("./akifClinic/v1/middlewares/errorHandler");

const app = express();
const port = Number(process.env.PORT || 4000);
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable("x-powered-by");
app.set("trust proxy", Number(process.env.TRUST_PROXY || 1));
app.use(i18nMiddleware);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin is not allowed by CORS."));
    },
  }),
);
app.use(express.json({ limit: "250kb" }));

app.use("/api/akifclinic/v1", apiRouter);

app.use((request, response) =>
  sendError(response, {
    statusCode: 404,
    message: request.t("errors.notFound"),
  }),
);
app.use(errorHandler);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Akif Poliklinik API http://localhost:${port} adresinde çalışıyor.`);
  });
}

module.exports = app;
