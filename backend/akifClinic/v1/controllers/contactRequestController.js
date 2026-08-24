const { sendError, sendSuccess } = require("../../../general_helpers/response");
const validateContactRequest = require("../helpers/contactRequestValidation");
const contactRequestService = require("../services/contactRequestService");

const allowedStatuses = new Set(["new", "contacted", "qualified", "closed", "spam"]);

async function create(request, response) {
  const validation = validateContactRequest(request.body || {}, request.language);

  if (!validation.isValid) {
    return sendError(response, {
      statusCode: 422,
      message: request.t(validation.messageKey),
    });
  }

  if (validation.isSpam) {
    return sendSuccess(response, {
      statusCode: 201,
      message: request.t("contact.created"),
    });
  }

  const id = await contactRequestService.createContactRequest({
    ...validation.values,
    source: "website",
    ipAddress: request.ip?.slice(0, 45) || null,
    userAgent: request.get("user-agent")?.slice(0, 500) || null,
  });

  return sendSuccess(response, {
    statusCode: 201,
    message: request.t("contact.created"),
    data: { id },
  });
}

async function list(request, response) {
  const page = Math.max(Number.parseInt(request.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(request.query.limit, 10) || 20, 1), 100);
  const status = allowedStatuses.has(request.query.status) ? request.query.status : null;
  const result = await contactRequestService.listContactRequests({ page, limit, status });

  return sendSuccess(response, {
    message: request.t("contact.listed"),
    data: {
      records: result.rows,
      pagination: {
        page,
        limit,
        total: result.total,
        pageCount: Math.ceil(result.total / limit),
      },
    },
  });
}

async function update(request, response) {
  const id = Number.parseInt(request.params.id, 10);
  const status = request.body?.status;
  const adminNote =
    typeof request.body?.adminNote === "string"
      ? request.body.adminNote.trim().slice(0, 2000) || null
      : null;

  if (!Number.isInteger(id) || id < 1 || !allowedStatuses.has(status)) {
    return sendError(response, {
      statusCode: 422,
      message: request.t("contact.invalidUpdate"),
    });
  }

  const affectedRows = await contactRequestService.updateContactRequest(id, {
    status,
    adminNote,
  });

  if (!affectedRows) {
    return sendError(response, {
      statusCode: 404,
      message: request.t("contact.notFound"),
    });
  }

  return sendSuccess(response, {
    message: request.t("contact.updated"),
    data: { id },
  });
}

module.exports = { create, list, update };
