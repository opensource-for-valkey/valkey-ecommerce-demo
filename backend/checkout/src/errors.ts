export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly error: string,
    message: string,
    public readonly details: Record<string, unknown> = {}
  ) {
    super(message);
  }
}

export function errorBody(error: string, message: string, details: Record<string, unknown> = {}) {
  return { error, message, details };
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  const message = error instanceof Error ? error.message : "Unexpected server error";
  return new ApiError(500, "internal_error", message);
}
