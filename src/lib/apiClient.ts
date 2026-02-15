/* ======================================================
   API CLIENT — FINAL, STABLE, PRODUCTION VERSION
====================================================== */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface RequestOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

export class ApiClient {
  private readonly baseUrl: string;
  private deviceId: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;

    // Ensure device ID initializes only on client side AFTER hydration
    if (typeof window !== "undefined") {
      this.initializeDeviceId();
    }
  }

  /* ======================================================
     DEVICE ID MANAGEMENT — Browser Only
  ====================================================== */
  private initializeDeviceId(): void {
    if (typeof window === "undefined") return;

    let deviceId = localStorage.getItem("kbc_device_id");

    if (!deviceId) {
      deviceId = this.generateDeviceId();
      localStorage.setItem("kbc_device_id", deviceId);
    }
    this.deviceId = deviceId;
  }

  private generateDeviceId(): string {
    const timestamp = Date.now();
    const rand = crypto.getRandomValues(new Uint32Array(2));
    return `device_${timestamp}_${rand[0].toString(36)}${rand[1].toString(36)}`;
  }

  /* ======================================================
     AUTH TOKEN (Admin or Customer)
  ====================================================== */
  private getAuthHeader(): Record<string, string> {
    if (typeof window === "undefined") return {};

    const adminToken = localStorage.getItem("kbc_admin_token");
    if (adminToken) return { Authorization: `Bearer ${adminToken}` };

    const customerToken = localStorage.getItem("kbc_customer_token");
    if (customerToken) return { Authorization: `Bearer ${customerToken}` };

    return {};
  }

  /* ======================================================
     CORE REQUEST WRAPPER
  ====================================================== */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const { headers: customHeaders, ...fetchOptions } = options;

    // Guarantee deviceId exists before making the call
    if (!this.deviceId && typeof window !== "undefined") {
      this.initializeDeviceId();
    }

    const headers: Record<string, string> = {
      ...this.getAuthHeader(),
      ...(customHeaders ?? {}),
    };

    // Always attach device ID for guest tracking
    if (this.deviceId) {
      headers["x-device-id"] = this.deviceId;
    }

    // If body is not FormData → send JSON
    if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
      credentials: "include",
    });

    const text = await response.text();
    const data = text ? (JSON.parse(text) as ApiErrorResponse | T) : null;

    if (!response.ok) {
      const errorMessage =
        (data as ApiErrorResponse)?.message ??
        `HTTP ${response.status}: Request to ${endpoint} failed`;

      throw new Error(errorMessage);
    }

    return data as T;
  }

  /* ======================================================
     SIMPLE VERBS
  ====================================================== */
  get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T, B = unknown>(endpoint: string, body?: B, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T, B = unknown>(endpoint: string, body?: B, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  /* ======================================================
     FORMDATA (NO content-type)
  ====================================================== */
  postForm<T>(endpoint: string, formData: FormData) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: formData,
    });
  }

  patchForm<T>(endpoint: string, formData: FormData) {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: formData,
    });
  }

  /* ======================================================
     UTILITIES
  ====================================================== */
  public getCurrentDeviceId(): string | null {
    return this.deviceId;
  }

  public clearDeviceId(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("kbc_device_id");
    this.deviceId = null;
  }

  public regenerateDeviceId(): string {
    const newId = this.generateDeviceId();
    if (typeof window !== "undefined") {
      localStorage.setItem("kbc_device_id", newId);
    }
    this.deviceId = newId;
    return newId;
  }
}

/* ======================================================
   EXPORT FINAL CLIENT
====================================================== */
export const apiClient = new ApiClient();
