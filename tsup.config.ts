import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/tracker/tracker.ts"],

  format: ["iife"],

  minify: true,

  bundle: true,

  outDir: "public",

  outExtension() {
    return {
      js: ".js",
    };
  },
});