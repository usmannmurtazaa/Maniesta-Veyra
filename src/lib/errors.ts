export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super('UNAUTHORIZED', message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super('FORBIDDEN', message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Not found') {
    super('NOT_FOUND', message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation error', details?: unknown) {
    super('VALIDATION_ERROR', message, 400, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict') {
    super('CONFLICT', message, 409);
  }
}

export class OutOfStockError extends AppError {
  constructor(message: string = 'Out of stock') {
    super('OUT_OF_STOCK', message, 409);
  }
}

export class InvalidCouponError extends AppError {
  constructor(message: string = 'Invalid coupon') {
    super('INVALID_COUPON', message, 400);
  }
}

export class RateLimitedError extends AppError {
  constructor(message: string = 'Too many requests') {
    super('RATE_LIMITED', message, 429);
  }
}