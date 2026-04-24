import { RequestStatus } from "../enums/RequestStatus.js";

export class AppError extends Error {
  constructor(code = 500, status = RequestStatus.responsePhase.INTERNAL_SERVER_ERROR, message = "An unexpected error occurred") {
    super(message);
    this.code = code;
    this.status = status;
  }
}
