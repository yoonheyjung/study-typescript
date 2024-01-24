interface ErrorResponse {
  code: number;
  msg: string;
}

class ApplicationError extends Error {
  public statusCode: number;
  public errors: ErrorResponse[];

  constructor(
    statusCode: number = 500,
    message: string = "An error occurred",
    errors: ErrorResponse[] = []
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

class ValidationError extends ApplicationError {
  public code: number;

  constructor(code: number = 4000, message: string = "Validation Error") {
    super(400, message, [{ code, msg: message }]);
    this.code = code;
  }
}

class AuthenticationError extends ApplicationError {
  public code: number;

  constructor(code: number = 4010, message: string = "Authentication error") {
    super(401, message, [{ code, msg: message }]);
    this.code = code;
  }
}

class AuthorizationError extends ApplicationError {
  public code: number;

  constructor(code: number = 4030, message: string = "Authorization error") {
    super(403, message, [{ code, msg: message }]);
    this.code = code;
  }
}

class NotFoundError extends ApplicationError {
  public code: number;

  constructor(code: number = 4040, message: string = "Resource not found") {
    super(404, message, [{ code, msg: message }]);
    this.code = code;
  }
}

class ServerError extends ApplicationError {
  public code: number;

  constructor(code: number = 5000, message: string = "Server Error") {
    super(500, message, [{ code, msg: message }]);
    this.code = code;
  }
}
