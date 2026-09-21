export class ApiError<T = any> extends Error {
  status: number;
  statusText: string;
  data: T;

  constructor(status: number, statusText: string, data: T) {
    // If backend provided a message in the body, prioritize that in Error.message
    const message =
      (data && typeof data === "object" && "message" in data && typeof (data as any).message === "string")
        ? (data as any).message
        : `Request failed with status ${status}: ${statusText}`;

    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | undefined | null>;
  data?: any;
}

const BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, data, headers, ...customConfig } = options;

  // Build URL with query params
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  let url = `${BASE_URL}${cleanEndpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const isFormData = typeof FormData !== "undefined" && data instanceof FormData;

  const defaultHeaders: HeadersInit = isFormData
    ? {}
    : {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

  const config: RequestInit = {
    method: "GET",
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    credentials: "include", // Always include cookies for session authentication
    ...customConfig,
  };

  if (data !== undefined) {
    config.body = isFormData ? data : JSON.stringify(data);
  }

  const response = await fetch(url, config);

  // Parse JSON response safely
  let responseData: any = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }
  } else {
    // For non-JSON or empty responses
    const text = await response.text();
    try {
      responseData = text ? JSON.parse(text) : null;
    } catch {
      responseData = text;
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, response.statusText, responseData);
  }

  return responseData as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, data?: any, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "POST", data }),

  put: <T>(endpoint: string, data?: any, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "PUT", data }),

  patch: <T>(endpoint: string, data?: any, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "PATCH", data }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
