class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

type AuthErrorTypes =
  | "EMAIL_ALREADY_EXISTS"
  | "INVALID_CREDENTIALS"
  | "SESSION_EXPIRED"
  | "INVALID_TOKEN";

class AuthError extends Error {
  type: AuthErrorTypes;
  constructor(message: string, type: AuthErrorTypes) {
    super(message);
    this.type = type;
    this.name = "AuthError";
  }
}

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

export { ValidationError, AuthError, DatabaseError, NotFoundError };
