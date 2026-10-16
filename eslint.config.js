import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["node_modules/", "assets/vendor/", "test-results/", "playwright-report/"] },
  js.configs.recommended,
  {
    languageOptions: { ecmaVersion: 2024, sourceType: "module", globals: { ...globals.browser } },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-implicit-globals": "error",
      "prefer-const": "error"
    }
  },
  { files: ["assets/js/theme-init.js"], languageOptions: { sourceType: "script" } },
  { files: ["sw.js"], languageOptions: { sourceType: "script", globals: { ...globals.serviceworker } } },
  { files: ["tests/**", "scripts/**", "*.config.js"], languageOptions: { globals: { ...globals.node } } }
];
