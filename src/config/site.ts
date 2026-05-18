const siteUrl = (
  process.env.NEXT_PUBLIC_PULSESTAT_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://pulse-stat.ramnivas.in"
).replace(/\/+$/, "");

export const siteConfig = {
  name: "PulseStat",
  description: "Privacy-focused, real-time analytics SaaS. Get actionable insights without the clutter. Fast, simple, and developer-friendly.",
  url: siteUrl,
  ogImage: `${siteUrl}/og-image.png`,
  links: {
    twitter: "https://twitter.com/pulsestat",
    github: "https://github.com/pulsestat/pulsestat",
  },
  keywords: [
    "SaaS Analytics",
    "Real-time Analytics",
    "Privacy-friendly Analytics",
    "Simple Analytics",
    "Developer Tools",
    "Website Insights",
  ],
};
