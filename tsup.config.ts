import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/tracker/tracker.ts"],

  format: ["iife"],

  minify: true,

  bundle: true,

  outDir: "dist",

  outExtension() {
    return {
      js: ".js",
    };
  },
});