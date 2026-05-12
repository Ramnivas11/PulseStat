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
  screen: {
    width: number;
    height: number;
  };
  country: string;
  timestamp: string;
}

class PulseStatTracker {
  private siteId: string | null = null;
  private visitorId!: string;
  private sessionId!: string;
  private lastTrackedPath: string = '';
  private isInitialized = false;

  constructor() {
    this.initializeIds();
    this.setupSPATracking();
    this.trackPageView(); // Track initial page load
  }

  private initializeIds(): void {
    // Get site ID from script attribute
    const currentScript = document.currentScript as HTMLScriptElement;
    this.siteId = currentScript?.getAttribute("data-site-id");

    // Visitor ID - persists across sessions
    this.visitorId = localStorage.getItem("pulsestat_visitor_id") || '';
    if (!this.visitorId) {
      this.visitorId = crypto.randomUUID();
      localStorage.setItem("pulsestat_visitor_id", this.visitorId);
    }

    // Session ID - resets on new session
    this.sessionId = sessionStorage.getItem("pulsestat_session_id") || '';
    if (!this.sessionId) {
      this.sessionId = crypto.randomUUID();
      sessionStorage.setItem("pulsestat_session_id", this.sessionId);
    }
  }

  private createPayload(path?: string): TrackingPayload {
    return {
      siteId: this.siteId,
      visitorId: this.visitorId,
      sessionId: this.sessionId,
      path: path || window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      screen: {
        width: window.screen.width,
        height: window.screen.height,
      },
      country: "Unknown",
      timestamp: new Date().toISOString(),
    };
  }

  private sendTrackingData(payload: TrackingPayload): void {
    try {
      const endpoint = new URL("/api/track", window.location.origin).toString();
      navigator.sendBeacon(endpoint, JSON.stringify(payload));
    } catch (error) {
      console.warn("PulseStat: Failed to send tracking data", error);
    }
  }

  public trackPageView(path?: string): void {
    const currentPath = path || window.location.pathname;

    // Prevent duplicate tracking of the same path
    if (currentPath === this.lastTrackedPath) {
      return;
    }

    this.lastTrackedPath = currentPath;
    const payload = this.createPayload(currentPath);
    this.sendTrackingData(payload);
  }

  private setupSPATracking(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Intercept history.pushState
    const originalPushState = history.pushState;
    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      // Track after a short delay to ensure URL has updated
      setTimeout(() => this.trackPageView(), 0);
    };

    // Intercept history.replaceState
    const originalReplaceState = history.replaceState;
    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      setTimeout(() => this.trackPageView(), 0);
    };

    // Listen for browser back/forward navigation
    window.addEventListener('popstate', () => {
      this.trackPageView();
    });
  }
}

// Auto-initialize when script loads
new PulseStatTracker();