// PulseStat Analytics Tracker v2
// Umami-compatible: hostname, title, UTM params, visitId, custom events, screen WxH

interface TrackPayload {
  siteId: string;
  visitorId: string;
  sessionId: string;
  visitId: string;
  path: string;
  hostname: string;
  urlQuery: string;
  pageTitle: string;
  referrer: string;
  userAgent: string;
  language: string;
  timezone: string;
  screenWidth: number;
  screenHeight: number;
  // UTM
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  // Custom event
  eventName?: string;
  // Geo (client-side hint — may be empty)
  country: string;
  timestamp: string;
  lastActiveAt: string;
}

class PulseStatTracker {
  private siteId: string | null = null;
  private visitorId = "";
  private sessionId = "";
  private visitId = "";
  private lastTrackedPath = "";
  private isInitialized = false;
  private endpointUrl = "";
  private visitStartedAt = 0;
  private lastEventAt = 0;
  // Rotate visitId after 30-min inactivity (mirrors Umami session logic)
  private static VISIT_TIMEOUT_MS = 30 * 60 * 1000;

  constructor() {
    this.initialize();
    this.setupSPATracking();
    this.trackPageView();
  }

  // ── ID utilities ──────────────────────────────────────────────────────────

  private generateId(): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  private read(storage: Storage, key: string): string | null {
    try { return storage.getItem(key); } catch { return null; }
  }

  private write(storage: Storage, key: string, value: string): void {
    try { storage.setItem(key, value); } catch { /* private mode */ }
  }

  // ── Init ─────────────────────────────────────────────────────────────────

  private initialize(): void {
    const script =
      (document.currentScript as HTMLScriptElement | null) ??
      Array.from(document.scripts).find((s) => s.src.includes("tracker.js"));

    if (script) {
      this.siteId = script.dataset.siteId ?? null;
      const configuredApiUrl = script.dataset.apiUrl;
      try {
        if (configuredApiUrl) {
          const url = new URL(configuredApiUrl, location.href);
          this.endpointUrl = url.pathname.endsWith("/api/track")
            ? url.toString()
            : `${url.origin}/api/track`;
        } else {
          this.endpointUrl = `${new URL(script.src, location.href).origin}/api/track`;
        }
      } catch {
        this.endpointUrl = `${location.origin}/api/track`;
      }
    }

    // Persistent visitor ID (localStorage)
    this.visitorId = this.read(localStorage, "_ps_vid") ?? this.generateId();
    this.write(localStorage, "_ps_vid", this.visitorId);

    // Session ID (sessionStorage — cleared when tab closes)
    this.sessionId = this.read(sessionStorage, "_ps_sid") ?? this.generateId();
    this.write(sessionStorage, "_ps_sid", this.sessionId);

    // Visit ID — rotates after 30 min inactivity
    const storedVisitId = this.read(sessionStorage, "_ps_vid2");
    const storedVisitTs = Number(this.read(sessionStorage, "_ps_vts") ?? "0");
    const now = Date.now();

    if (storedVisitId && now - storedVisitTs < PulseStatTracker.VISIT_TIMEOUT_MS) {
      this.visitId = storedVisitId;
      this.visitStartedAt = storedVisitTs;
    } else {
      this.visitId = this.generateId();
      this.visitStartedAt = now;
      this.write(sessionStorage, "_ps_vid2", this.visitId);
      this.write(sessionStorage, "_ps_vts", String(now));
    }
  }

  // ── Payload construction ──────────────────────────────────────────────────

  private normalizePath(raw?: string): string {
    const p = (raw ?? location.pathname + location.search).split("#")[0] ?? "/";
    return (p.replace(/\/+$/, "") || "/").slice(0, 2000);
  }

  private extractUTM(search: string) {
    const p = new URLSearchParams(search);
    return {
      utmSource:   p.get("utm_source")   ?? undefined,
      utmMedium:   p.get("utm_medium")   ?? undefined,
      utmCampaign: p.get("utm_campaign") ?? undefined,
      utmContent:  p.get("utm_content")  ?? undefined,
      utmTerm:     p.get("utm_term")     ?? undefined,
    };
  }

  private refreshVisitId(): void {
    const now = Date.now();
    if (now - this.visitStartedAt >= PulseStatTracker.VISIT_TIMEOUT_MS) {
      this.visitId = this.generateId();
      this.visitStartedAt = now;
      this.write(sessionStorage, "_ps_vid2", this.visitId);
      this.write(sessionStorage, "_ps_vts", String(now));
    } else {
      this.write(sessionStorage, "_ps_vts", String(now));
    }
  }

  private buildPayload(path?: string, eventName?: string): TrackPayload | null {
    if (!this.siteId) return null;

    const normalPath = this.normalizePath(path);
    const search = location.search;
    const utm = this.extractUTM(search);
    const now = new Date();

    return {
      siteId:      this.siteId,
      visitorId:   this.visitorId,
      sessionId:   this.sessionId,
      visitId:     this.visitId,
      path:        normalPath,
      hostname:    location.hostname,
      urlQuery:    search.slice(1, 2000) || "",
      pageTitle:   document.title.slice(0, 300),
      referrer:    document.referrer.slice(0, 2000),
      userAgent:   navigator.userAgent.slice(0, 512),
      language:    navigator.language,
      timezone:    Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC",
      screenWidth: screen.width,
      screenHeight: screen.height,
      country:     "",           // resolved server-side from IP
      timestamp:   now.toISOString(),
      lastActiveAt: now.toISOString(),
      eventName,
      ...utm,
    };
  }

  // ── Transport ─────────────────────────────────────────────────────────────

  private send(payload: TrackPayload): void {
    if (!this.endpointUrl) return;
    const body = JSON.stringify(payload);
    const url = this.endpointUrl;

    if (navigator.sendBeacon) {
      const ok = navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
      if (ok) return;
    }

    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      mode: "cors",
      credentials: "omit",
    }).catch(() => { /* analytics must never crash the host app */ });
  }

  // ── Public API ────────────────────────────────────────────────────────────

  public trackPageView(path?: string): void {
    const now = Date.now();
    const currentPath = this.normalizePath(path);

    // Deduplicate rapid SPA navigations
    if (currentPath === this.lastTrackedPath && now - this.lastEventAt < 400) return;

    this.refreshVisitId();

    const payload = this.buildPayload(currentPath);
    if (!payload) return;

    this.lastTrackedPath = currentPath;
    this.lastEventAt = now;
    this.send(payload);
  }

  public trackEvent(eventName: string): void {
    this.refreshVisitId();
    const payload = this.buildPayload(undefined, eventName);
    if (payload) {
      this.lastEventAt = Date.now();
      this.send(payload);
    }
  }

  // ── SPA hooks ─────────────────────────────────────────────────────────────

  private setupSPATracking(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    const wrap = (original: typeof history.pushState) =>
      function (this: History, ...args: Parameters<typeof history.pushState>) {
        original.apply(this, args);
        setTimeout(() => tracker.trackPageView(), 0);
      };

    history.pushState    = wrap(history.pushState.bind(history));
    history.replaceState = wrap(history.replaceState.bind(history));
    window.addEventListener("popstate", () => this.trackPageView(), { passive: true });
  }
}

let tracker: PulseStatTracker;

if (typeof window !== "undefined") {
  window.setTimeout(() => { tracker = new PulseStatTracker(); }, 0);
}


// Expose public API on window.pulsestat for manual event tracking
// Type declaration lives in tracker.d.ts
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).pulsestat = {
    track: (eventName: string) => tracker?.trackEvent(eventName),
    pageview: (path?: string) => tracker?.trackPageView(path),
  };
}
