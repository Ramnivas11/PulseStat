import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/tracker/tracker.ts"],
  format: ["iife"],
  minify: true,
  outDir: "public",
  outExtension: () => ({ js: ".js" }),
  platform: "browser",
  target: "es2017",
  clean: false,
  globalName: "PulseStatSDK",
});
