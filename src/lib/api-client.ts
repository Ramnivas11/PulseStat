/**
 * Lightweight API client wrapper for fetch with structured error handling.
 */

type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: string; status?: number };

export async function apiGet<T = unknown>(url: string, opts?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, { credentials: 'same-origin', ...opts });
    const text = await res.text();
    if (!text) {
      if (!res.ok) return { ok: false, error: res.statusText || 'Empty response', status: res.status };
      return { ok: true, data: undefined as unknown as T };
    }

    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      // response may already be a serialized JSON string
      return { ok: false, error: 'Invalid JSON response from server', status: res.status };
    }

    if (!res.ok) {
      const message = (json && typeof json === "object" && ("error" in json || "message" in json)
        ? (json as Record<string, unknown>).error || (json as Record<string, unknown>).message
        : null) || res.statusText || 'API Error';
      return { ok: false, error: String(message), status: res.status };
    }

    return { ok: true, data: json as T };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function apiPost<T = unknown>(url: string, body?: unknown, opts?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      method: "POST",
      credentials: 'same-origin',
      body: body ? JSON.stringify(body) : undefined,
      headers: { "Content-Type": "application/json" },
      ...opts,
    });
    const text = await res.text();
    if (!text) {
      if (!res.ok) return { ok: false, error: res.statusText || 'Empty response', status: res.status };
      return { ok: true, data: undefined as unknown as T };
    }

    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      return { ok: false, error: 'Invalid JSON response from server', status: res.status };
    }

    if (!res.ok) {
      const message = (json && typeof json === "object" && ("error" in json || "message" in json)
        ? (json as Record<string, unknown>).error || (json as Record<string, unknown>).message
        : null) || res.statusText || 'API Error';
      return { ok: false, error: String(message), status: res.status };
    }

    return { ok: true, data: json as T };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function apiPatch<T = unknown>(url: string, body?: unknown, opts?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      method: "PATCH",
      credentials: 'same-origin',
      body: body ? JSON.stringify(body) : undefined,
      headers: { "Content-Type": "application/json" },
      ...opts,
    });
    const text = await res.text();
    if (!text) {
      if (!res.ok) return { ok: false, error: res.statusText || 'Empty response', status: res.status };
      return { ok: true, data: undefined as unknown as T };
    }

    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      return { ok: false, error: 'Invalid JSON response from server', status: res.status };
    }

    if (!res.ok) {
      const message = (json && typeof json === "object" && ("error" in json || "message" in json)
        ? (json as Record<string, unknown>).error || (json as Record<string, unknown>).message
        : null) || res.statusText || 'API Error';
      return { ok: false, error: String(message), status: res.status };
    }

    return { ok: true, data: json as T };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export default apiGet;
