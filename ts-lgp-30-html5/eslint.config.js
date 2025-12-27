import globals from "globals";
import tseslint from "typescript-eslint";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // 1. Global Ignores
  {
    ignores: ["dist/**", "docs/**", "coverage/**"],
  },

  // 2. Base Configuration for all scripts
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // 3. Recommended Linting (Syntax-only, safe for all files)
  ...tseslint.configs.recommended,

  // 4. Type-Checked Linting (Catches TS2345 equivalents)
  // We strictly target ONLY TS files to avoid the "Error loading rule" on .md files
  {
    files: ["**/*.{ts,mts,cts}"],
    languageOptions: {
      parserOptions: {
        projectService: true, // Modern replacement for 'project: true'
        tsconfigRootDir: import.meta.dirname,
      },
    },
    // Spread the type-checked rules directly into this block
    rules: {
      ...tseslint.plugin.configs['recommended-type-checked'].rules,
      // Specific rules to catch assignability (TS2345) issues:
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/await-thenable": "error",
      "semi": ["error", "always"],
    },
  },

  // 5. Markdown Configuration
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
  },

  // 6. CSS Configuration
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css"
  },
]);