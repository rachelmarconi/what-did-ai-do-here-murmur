import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
import dsv from "@rollup/plugin-dsv";
import archieml from "rollup-plugin-archieml";

export default defineConfig({
  plugins: [sveltekit(), archieml(), dsv()],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}", "test/**/*.{test,spec}.{js,ts}"]
  }
});
