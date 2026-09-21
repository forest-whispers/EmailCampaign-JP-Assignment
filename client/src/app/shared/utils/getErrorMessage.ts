/**
 * Extracts a user-facing error message from backend responses or thrown exceptions.
 * Ensures the actual backend message (e.g. "Email is already registered") is preserved
 * and never replaced with a generic fallback when a backend message is available.
 */
export function getErrorMessage(error: unknown, fallback = "An unexpected error occurred"): string {
  if (!error) return fallback;

  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }

  if (typeof error === "object") {
    const err = error as Record<string, any>;

    // Handle ApiError or response data container
    const data = err.data || err.response?.data || err.response || err;

    // 1. Direct message field
    if (typeof data.message === "string" && data.message.trim().length > 0) {
      return data.message;
    }

    // 2. Direct error field
    if (typeof data.error === "string" && data.error.trim().length > 0) {
      return data.error;
    }

    // 3. Structured validation errors: { issues: [{ message: "..." }] }
    if (Array.isArray(data.issues) && data.issues.length > 0) {
      const firstIssue = data.issues[0];
      if (typeof firstIssue?.message === "string" && firstIssue.message.trim().length > 0) {
        return firstIssue.message;
      }
    }

    // 4. Structured validation errors: { errors: [{ message: "..." }] } or { errors: { field: [...] } }
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      const firstError = data.errors[0];
      if (typeof firstError === "string") return firstError;
      if (typeof firstError?.message === "string" && firstError.message.trim().length > 0) {
        return firstError.message;
      }
    } else if (data.errors && typeof data.errors === "object") {
      const firstKey = Object.keys(data.errors)[0];
      if (firstKey) {
        const val = data.errors[firstKey];
        if (typeof val === "string") return val;
        if (Array.isArray(val) && val.length > 0 && typeof val[0] === "string") {
          return val[0];
        }
      }
    }

    // 5. Standard Error object message
    if (typeof err.message === "string" && err.message.trim().length > 0) {
      return err.message;
    }
  }

  return fallback;
}
