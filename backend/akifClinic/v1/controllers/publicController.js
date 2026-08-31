const { sendSuccess } = require("../../../general_helpers/response");
const doctorService = require("../services/doctorService");
const siteSettingsService = require("../services/siteSettingsService");

function getHealth(request, response) {
  return sendSuccess(response, {
    message: request.t("health.ready"),
    data: {
      service: "akif-poliklinik-api",
      version: "v1",
    },
  });
}

async function getSiteSettings(request, response) {
  const settings = await siteSettingsService.getSiteSettings();

  return sendSuccess(response, {
    message: request.t("settings.retrieved"),
    data: settings,
  });
}

async function getDoctors(request, response) {
  const doctors = await doctorService.listPublicDoctors();

  return sendSuccess(response, {
    message: request.t("doctors.publicListed"),
    data: { doctors },
  });
}

module.exports = { getDoctors, getHealth, getSiteSettings };
