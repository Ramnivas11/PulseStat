import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { url: siteConfig.url, priority: 1 },
    { url: `${siteConfig.url}/login`, priority: 0.8 },
    { url: `${siteConfig.url}/signup`, priority: 0.8 },
    { url: `${siteConfig.url}/pricing`, priority: 0.7 },
    { url: `${siteConfig.url}/privacy`, priority: 0.4 },
    { url: `${siteConfig.url}/terms`, priority: 0.4 },
  ];

  return routes.map((r) => ({
    ...r,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "weekly" as const,
  }));
}
