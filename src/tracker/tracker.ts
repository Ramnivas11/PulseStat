// PulseStat Analytics SDK
// Lightweight, production-ready SPA tracking

interface TrackingPayload {
  siteId: string | null;
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
  private visitorId!: string;
  private sessionId!: string;
  private lastTrackedPath: string = "";
  private isInitialized = false;
  private baseUrl: string = "";

  constructor() {
    this.initialize();
    this.setupSPATracking();
    this.trackPageView();
  }

  private generateId(): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private initialize(): void {
    // 1. Find the script tag and its origin
    const currentScript = (document.currentScript as HTMLScriptElement) || 
      Array.from(document.getElementsByTagName("script")).find(s => s.src.includes("tracker.js"));
    
    if (currentScript) {
      this.siteId = currentScript.getAttribute("data-site-id");
      try {
        const url = new URL(currentScript.src);
        this.baseUrl = url.origin;
      } catch {
        this.baseUrl = "";
      }
    }

    // 2. Initialize IDs with fallback
    let visitorId = localStorage.getItem("_ps_vid");
    if (!visitorId) {
      visitorId = this.generateId();
      localStorage.setItem("_ps_vid", visitorId);
    }
    this.visitorId = visitorId;

    let sessionId = sessionStorage.getItem("_ps_sid");
    if (!sessionId) {
      sessionId = this.generateId();
      sessionStorage.setItem("_ps_sid", sessionId);
    }
    this.sessionId = sessionId;
  }

  private createPayload(path?: string): TrackingPayload {
    const normalizedPath = (path || window.location.pathname).replace(/\/+$/, "") || "/";
    return {
      siteId: this.siteId,
      visitorId: this.visitorId,
      sessionId: this.sessionId,
      path: normalizedPath,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      country: "Unknown",
      timestamp: new Date().toISOString(),
    };
  }

  private async sendTrackingData(payload: TrackingPayload): Promise<void> {
    if (!this.siteId || !this.baseUrl) return;
    
    try {
      const endpoint = `${this.baseUrl}/api/track`;
      
      // Use fetch with keepalive: true (modern alternative to sendBeacon)
      // This allows us to see the request in the Network tab more easily
      await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        keepalive: true,
        mode: "cors",
      });
    } catch (e) {
      // Silent fail
    }
  }

  public trackPageView(path?: string): void {
    const currentPath = (path || window.location.pathname).replace(/\/+$/, "") || "/";
    if (currentPath === this.lastTrackedPath) return;
    this.lastTrackedPath = currentPath;
    this.sendTrackingData(this.createPayload(currentPath));
  }

  private setupSPATracking(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    const originalPushState = history.pushState.bind(history);
    history.pushState = (...args) => {
      originalPushState(...args);
      setTimeout(() => this.trackPageView(), 0);
    };

    const originalReplaceState = history.replaceState.bind(history);
    history.replaceState = (...args) => {
      originalReplaceState(...args);
      setTimeout(() => this.trackPageView(), 0);
    };

    window.addEventListener("popstate", () => this.trackPageView());
  }
}

// Initialized immediately
if (typeof window !== "undefined") {
  new PulseStatTracker();
}
