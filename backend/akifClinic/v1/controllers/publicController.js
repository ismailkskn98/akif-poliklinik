const { sendSuccess } = require("../../../general_helpers/response");

function getHealth(request, response) {
  return sendSuccess(response, {
    message: request.t("health.ready"),
    data: {
      service: "akif-poliklinik-api",
      version: "v1",
    },
  });
}

module.exports = { getHealth };
