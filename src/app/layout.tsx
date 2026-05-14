import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/shared/providers";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: "PulseStat Team", url: siteConfig.url }],
  creator: "PulseStat",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@pulsestat",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        {process.env.NEXT_PUBLIC_PULSESTAT_SITE_ID && (
          <script
            async
            src="/tracker.js"
            data-site-id={process.env.NEXT_PUBLIC_PULSESTAT_SITE_ID}
          />
        )}
        <Providers>
          <ThemeProvider>
            <Toaster />
            <div className="flex-1 flex flex-col">
              {children}
            </div>
            {/* Footer is handled per-layout (marketing / dashboard / auth) */}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
