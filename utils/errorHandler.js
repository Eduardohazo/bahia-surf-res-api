// utils/errorHandler.js
import { sendResponse } from "./responseHandler.js";
import { RequestStatus } from "../enums/RequestStatus.js";

export const handleError = (err, req, res, next) => {
  const { status, code, message } = err;
  console.log(err.name, err.code);

  const isDatabaseDown =
    err.name?.includes("Mongo") ||
    err.name?.includes("BSON") ||
    err.constructor?.name?.includes("Mongo") ||
    err.message.includes("ObjectId") ||
    err.code === "ETIMEDOUT" ||
    err.code === "ECONNREFUSED" ||
    err.isAxiosError;
  
  // 1. INPUT VALIDATION (sanitize / cleanup)
  if (status === RequestStatus.responsePhase.INPUT_VALIDATION_ERROR) {
    return sendResponse(
      res,
      code || 400,
      status,
      message || "The request has wrong data or is empty",
      null
    );
  }

  // 2. VALIDATION ERROR (ZOD)
  if (status === RequestStatus.responsePhase.VALIDATION_ERROR) {
    return sendResponse(
      res,
      code || 400,
      status,
      message || "Validation error on ZOD",
      err.errors?.map((e) => ({
        field: e.path[0],
        issue: e.message,
      }))
    );
  }

  // 3. DATA CORRUPTION (DB)
  if (status === RequestStatus.responsePhase.DATA_CORRUPTION) {
    return sendResponse(
      res,
      code || 500,
      status,
      message || "Data is corrupted in db",
      null
    );
  }

  // 4. NOT FOUND (PRODUCT / ORDER)
  if (
    status === RequestStatus.responsePhase.PRODUCT_NOT_FOUND ||
    status === RequestStatus.responsePhase.ORDER_NOT_FOUND
  ) {
    return sendResponse(
      res,
      code || 404,
      status,
      message || "Resource not found",
      null
    );
  }

  // 5. BUSINESS LOGIC
  if (
    status === RequestStatus.responsePhase.OUT_OF_STOCK ||
    status === RequestStatus.errorPhase.ERROR
  ) {
    return sendResponse(
      res,
      code || 409,
      status,
      message || "Something happened with business logic",
      null
    );
  }

  // 6. INFRASTRUCTURE (DB down / network)
  if (isDatabaseDown) {
    return sendResponse(
      res,
      503,
      RequestStatus.responsePhase.SERVER_ERROR,
      "Environment execution on server failed",
      null
    );
  }

  // 7. FALLBACK (UNKNOWN ERROR)
  console.error("🔥 Unexpected Bug:", err);

  return sendResponse(
    res,
    code || 500,
    status || RequestStatus.responsePhase.INTERNAL_SERVER_ERROR,
    message || "An unexpected error occurred",
    null
  );
};




