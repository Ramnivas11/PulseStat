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
  lastActiveAt: string;
}

class PulseStatTracker {
  private siteId: string | null = null;
  private endpointOrigin: string = "https://pulsestat.ramnivas.in";
  private visitorId!: string;
  private sessionId!: string;
  private lastTrackedPath: string = '';
  private isInitialized = false;

  // In-memory fallback storage for environments where localStorage/sessionStorage is blocked
  private memoryStorage: Record<string, string> = {};

  constructor() {
    try {
      this.initializeIds();
      this.setupSPATracking();
      this.trackPageView(); // Track initial page load
    } catch (error) {
      // Gracefully catch any instantiation errors to avoid breaking the client site
      console.warn("PulseStat: Tracker initialization failed gracefully", error);
    }
  }

  private getStorageValue(type: "local" | "session", key: string): string {
    try {
      if (typeof window !== "undefined") {
        const storage = type === "local" ? window.localStorage : window.sessionStorage;
        if (storage) {
          return storage.getItem(key) || "";
        }
      }
    } catch (e) {
      // Storage access blocked or unsupported (e.g. disabled cookies)
    }
    return this.memoryStorage[key] || "";
  }

  private setStorageValue(type: "local" | "session", key: string, value: string): void {
    try {
      if (typeof window !== "undefined") {
        const storage = type === "local" ? window.localStorage : window.sessionStorage;
        if (storage) {
          storage.setItem(key, value);
          return;
        }
      }
    } catch (e) {
      // Storage write blocked or unsupported
    }
    this.memoryStorage[key] = value;
  }

  private generateUUID(): string {
    try {
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
      }
    } catch (e) {
      // crypto.randomUUID failed (e.g. non-secure HTTP context)
    }

    // RFC4122 v4 compliant fallback
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private initializeIds(): void {
    // Get site ID from script attribute
    let currentScript: HTMLScriptElement | null = null;
    try {
      currentScript = document.currentScript as HTMLScriptElement;
    } catch (e) {
      // Safe access
    }

    this.siteId = currentScript?.getAttribute("data-site-id") || null;
    
    try {
      if (currentScript?.src) {
        this.endpointOrigin = new URL(currentScript.src).origin;
      }
    } catch (e) {
      // Fallback to default endpointOrigin
    }

    // Visitor ID - persists across sessions
    this.visitorId = this.getStorageValue("local", "pulsestat_visitor_id");
    if (!this.visitorId) {
      this.visitorId = this.generateUUID();
      this.setStorageValue("local", "pulsestat_visitor_id", this.visitorId);
    }

    // Session ID - resets on new session
    this.sessionId = this.getStorageValue("session", "pulsestat_session_id");
    if (!this.sessionId) {
      this.sessionId = this.generateUUID();
      this.setStorageValue("session", "pulsestat_session_id", this.sessionId);
    }
  }

  private createPayload(path?: string): TrackingPayload {
    let referrer = "";
    let language = "en";
    let timezone = "UTC";
    let screenWidth = 0;
    let screenHeight = 0;
    let userAgent = "";

    try {
      referrer = document.referrer || "";
      language = navigator.language || "en";
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      screenWidth = window.screen.width || 0;
      screenHeight = window.screen.height || 0;
      userAgent = navigator.userAgent || "";
    } catch (e) {
      // Safe fallback
    }

    return {
      siteId: this.siteId,
      visitorId: this.visitorId,
      sessionId: this.sessionId,
      path: path || window.location.pathname || "/",
      referrer,
      userAgent,
      language,
      timezone,
      screenWidth,
      screenHeight,
      country: "Unknown",
      timestamp: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };
  }

  private sendTrackingData(payload: TrackingPayload): void {
    try {
      const endpoint = new URL("/api/track", this.endpointOrigin).toString();
      const payloadString = JSON.stringify(payload);
      
      // Try sendBeacon first
      if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        const blob = new Blob([payloadString], { type: "text/plain" });
        const beaconSuccess = navigator.sendBeacon(endpoint, blob);
        if (beaconSuccess) return;
      }

      // Fallback to standard fetch with keepalive
      if (typeof fetch === "function") {
        fetch(endpoint, {
          method: "POST",
          body: payloadString,
          headers: {
            "Content-Type": "text/plain",
          },
          keepalive: true,
        }).catch(() => {
          // Fail silently
        });
      }
    } catch (error) {
      // Fail silently to never impact embedding site's behavior
    }
  }

  public trackPageView(path?: string): void {
    try {
      const currentPath = path || window.location.pathname || "/";

      // Prevent duplicate tracking of the same path
      if (currentPath === this.lastTrackedPath) {
        return;
      }

      this.lastTrackedPath = currentPath;
      const payload = this.createPayload(currentPath);
      this.sendTrackingData(payload);
    } catch (error) {
      // Fail silently
    }
  }

  private setupSPATracking(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    try {
      // Intercept history.pushState
      const originalPushState = history.pushState;
      if (typeof originalPushState === "function") {
        history.pushState = (...args) => {
          try {
            originalPushState.apply(history, args);
          } catch (e) {
            // Keep original behavior if apply fails
          }
          // Track after a short delay to ensure URL has updated
          setTimeout(() => this.trackPageView(), 0);
        };
      }

      // Intercept history.replaceState
      const originalReplaceState = history.replaceState;
      if (typeof originalReplaceState === "function") {
        history.replaceState = (...args) => {
          try {
            originalReplaceState.apply(history, args);
          } catch (e) {
            // Keep original behavior if replace fails
          }
          setTimeout(() => this.trackPageView(), 0);
        };
      }

      // Listen for browser back/forward navigation
      window.addEventListener("popstate", () => {
        this.trackPageView();
      });
    } catch (error) {
      // Safe fallback if history API is not supported/throws
    }
  }
}

// Auto-initialize when script loads in browser context
if (typeof window !== "undefined") {
  try {
    new PulseStatTracker();
  } catch (error) {
    // Fail silently
  }
}
