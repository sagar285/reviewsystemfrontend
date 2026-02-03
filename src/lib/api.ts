const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL || "https://aws.sattaking555.com")
    : process.env.NEXT_PUBLIC_API_URL || "https://aws.sattaking555.com";

export function apiUrl(path: string, search?: Record<string, string>): string {
  const url = new URL(path.startsWith("http") ? path : `${API_BASE.replace(/\/$/, "")}/${path.replace(/^\//, "")}`);
  if (search) {
    Object.entries(search).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  return url.toString();
}

export async function fetchApi<T>(
  path: string,
  options?: RequestInit & { params?: Record<string, string> }
): Promise<T> {
  const { params, ...rest } = options || {};
  const url = apiUrl(path, params);
  const res = await fetch(url, {
    ...rest,
    headers: { "Content-Type": "application/json", ...rest.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof data.message === "string" ? data.message : "Request failed");
  }
  return data as T;
}
