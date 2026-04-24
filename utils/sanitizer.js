import { AppError } from "../errors/AppError.js";
import { RequestStatus } from "../enums/RequestStatus.js";

export function sanitize(value) {
  // 1. Active validaton: If value is null or is not an object with keys (initial call)
  if (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0)
  ) {
    throw new AppError(
      400,
      RequestStatus.responsePhase.INPUT_VALIDATION_ERROR,
      "The request is emty or wrong data",
    );
  }

  // --- Cleanup Logic (Recursive) ---
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return isNaN(value) ? 0 : value;
  if (Array.isArray(value)) return value.map((v) => sanitizeInternal(v));

  if (value !== null && typeof value === "object") {
    if (
      value._bsontype === "ObjectID" ||
      value.constructor.name === "ObjectId"
    ) {
      return value;
    }

    const clean = {};
    Object.keys(value).forEach((key) => {
      clean[key] = sanitizeInternal(value[key]);
    });
    return clean;
  }

  return value;
}

// Función interna para no relanzar el error en cada nivel de recursión
function sanitizeInternal(value) {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return isNaN(value) ? 0 : value;
  if (Array.isArray(value)) return value.map(sanitizeInternal);
  if (value !== null && typeof value === "object") {
    const clean = {};
    Object.keys(value).forEach((key) => {
      clean[key] = sanitizeInternal(value[key]);
    });
    return clean;
  }
  return value;
}
