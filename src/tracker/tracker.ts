// PulseStat Analytics SDK
// Lightweight, production-ready SPA tracking with sendBeacon fallback.

interface TrackingPayload {
  siteId: string;
  visitorId: string;
  sessionId: string;
  path: string;
  referrer: string;
  userAgent: string;
  language: string;
  timezone: string;
  screenWidth: number;
  screenHeight: number;
  country: string;
  timestamp: string;
}

class PulseStatTracker {
  private siteId: string | null = null;
  private visitorId = "";
  private sessionId = "";
  private lastTrackedPath = "";
  private isInitialized = false;
  private baseUrl = "";
  private lastEventAt = 0;

  constructor() {
    this.initialize();
    this.setupSPATracking();
    this.trackPageView();
  }

  private generateId(): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
      const random = (Math.random() * 16) | 0;
      const value = character === "x" ? random : (random & 0x3) | 0x8;
      return value.toString(16);
    });
  }

  private safeStorage(storage: Storage, key: string): string | null {
    try {
      return storage.getItem(key);
    } catch {
      return null;
    }
  }

  private setSafeStorage(storage: Storage, key: string, value: string): void {
    try {
      storage.setItem(key, value);
    } catch {
      // Storage can be unavailable in private browsing or sandboxed embeds.
    }
  }

  private initialize(): void {
    const currentScript =
      (document.currentScript as HTMLScriptElement | null) ??
      Array.from(document.getElementsByTagName("script")).find((script) => script.src.includes("tracker.js"));

    if (currentScript) {
      this.siteId = currentScript.getAttribute("data-site-id");
      try {
        this.baseUrl = new URL(currentScript.src).origin;
      } catch {
        this.baseUrl = window.location.origin;
      }
    }

    const visitorId = this.safeStorage(localStorage, "_ps_vid") ?? this.generateId();
    this.setSafeStorage(localStorage, "_ps_vid", visitorId);
    this.visitorId = visitorId;

    const sessionId = this.safeStorage(sessionStorage, "_ps_sid") ?? this.generateId();
    this.setSafeStorage(sessionStorage, "_ps_sid", sessionId);
    this.sessionId = sessionId;
  }

  private normalizePath(path?: string): string {
    const parsedPath = (path || window.location.pathname).split("#")[0]?.slice(0, 2000) || "/";
    return parsedPath.replace(/\/+$/, "") || "/";
  }

  private createPayload(path?: string): TrackingPayload | null {
    if (!this.siteId) return null;

    return {
      siteId: this.siteId,
      visitorId: this.visitorId,
      sessionId: this.sessionId,
      path: this.normalizePath(path),
      referrer: document.referrer.slice(0, 2000),
      userAgent: navigator.userAgent.slice(0, 512),
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      country: "Unknown",
      timestamp: new Date().toISOString(),
    };
  }

  private sendTrackingData(payload: TrackingPayload): void {
    if (!this.siteId || !this.baseUrl) return;

    const endpoint = `${this.baseUrl}/api/track`;
    const body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      const sent = navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
      if (sent) return;
    }

    void fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      mode: "cors",
      credentials: "omit",
    }).catch(() => {
      // Analytics must never affect the host application.
    });
  }

  public trackPageView(path?: string): void {
    const now = Date.now();
    const currentPath = this.normalizePath(path);
    if (currentPath === this.lastTrackedPath || now - this.lastEventAt < 400) return;

    const payload = this.createPayload(currentPath);
    if (!payload) return;

    this.lastTrackedPath = currentPath;
    this.lastEventAt = now;
    this.sendTrackingData(payload);
  }

  private setupSPATracking(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    const originalPushState = history.pushState.bind(history);
    history.pushState = (...args) => {
      originalPushState(...args);
      window.setTimeout(() => this.trackPageView(), 0);
    };

    const originalReplaceState = history.replaceState.bind(history);
    history.replaceState = (...args) => {
      originalReplaceState(...args);
      window.setTimeout(() => this.trackPageView(), 0);
    };

    window.addEventListener("popstate", () => this.trackPageView(), { passive: true });
  }
}

if (typeof window !== "undefined") {
  window.setTimeout(() => new PulseStatTracker(), 0);
}
