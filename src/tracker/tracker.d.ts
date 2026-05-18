export {};

declare global {
  interface Window {
    pulsestat: {
      track: (eventName: string) => void;
      pageview: (path?: string) => void;
    };
  }
}
