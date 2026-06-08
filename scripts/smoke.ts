const baseUrl = process.env.PULSESTAT_BASE_URL ?? "http://localhost:3000";

type CheckResult = {
  name: string;
  ok: boolean;
  detail: string;
};

async function check(
  name: string,
  fn: () => Promise<string>
): Promise<CheckResult> {
  try {
    return {
      name,
      ok: true,
      detail: await fn(),
    };
  } catch (error) {
    return {
      name,
      ok: false,
      detail: error instanceof Error ? error.message : String(error),
    };
  }
}

async function expectStatus(path: string, expected: number[]) {
  const response = await fetch(new URL(path, baseUrl), {
    redirect: "manual",
  });

  if (!expected.includes(response.status)) {
    throw new Error(`Expected ${expected.join("/")} but received ${response.status}`);
  }

  return `${response.status} ${path}`;
}

const results = await Promise.all([
  check("tracker asset", async () => {
    const response = await fetch(new URL("/tracker.js", baseUrl));
    const body = await response.text();

    if (!response.ok || !body.includes("/api/track")) {
      throw new Error("Tracker asset did not load or does not contain the track endpoint");
    }

    return `${response.status} /tracker.js`;
  }),
  check("protected websites API", () => expectStatus("/api/websites", [401])),
  check("protected dashboard redirect", () => expectStatus("/dashboard", [302, 307])),
  check("optional tracking ingestion", async () => {
    const siteId = process.env.SMOKE_SITE_ID;
    const origin = process.env.SMOKE_ORIGIN;

    if (!siteId || !origin) {
      return "skipped; set SMOKE_SITE_ID and SMOKE_ORIGIN to exercise ingestion";
    }

    const now = new Date().toISOString();
    const response = await fetch(new URL("/api/track", baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
      },
      body: JSON.stringify({
        siteId,
        visitorId: `smoke_${Date.now()}`,
        sessionId: `smoke_${Date.now()}`,
        path: "/smoke",
        referrer: "",
        userAgent: "PulseStatSmoke/1.0",
        language: "en-US",
        timezone: "UTC",
        screenWidth: 1280,
        screenHeight: 720,
        country: "Unknown",
        timestamp: now,
        lastActiveAt: now,
      }),
    });

    if (!response.ok) {
      throw new Error(`Tracking returned ${response.status}: ${await response.text()}`);
    }

    return `${response.status} /api/track`;
  }),
]);

for (const result of results) {
  console.log(`${result.ok ? "PASS" : "FAIL"} ${result.name}: ${result.detail}`);
}

if (results.some((result) => !result.ok)) {
  process.exitCode = 1;
}

export {};
