const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(options.headers || {}),
  };

  const token = typeof window === "undefined" ? null : window.localStorage.getItem("auth-token");

  if (token && !("Authorization" in headers)) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  if (!isFormData && !("Content-Type" in headers)) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `API error: ${response.status}`;

    try {
      const data = (await response.json()) as { message?: string } | null;
      if (data?.message) {
        errorMessage = data.message;
      }
    } catch {
      // ignore parse errors
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}
