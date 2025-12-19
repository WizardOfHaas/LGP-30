import globals from "globals";
import tseslint from "typescript-eslint";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["dist/**", "docs/**", "coverage/**"], // exclude everything under dist
  },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  // {
  //   rules: {
  //     // Force semicolons
  //     "semi": ["error", "always"],
  //     // Note: ESLint core rules sometimes struggle with TS-specific syntax.
  //     // If you run into issues with interfaces or enums, see the Stylistic section below.
  //   },
  // },
  { files: ["**/*.md"], plugins: { markdown }, language: "markdown/gfm" },
  { files: ["**/*.css"], plugins: { css }, language: "css/css" },
]);
