import eslint from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier/recommended";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";

export default [
  eslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    rules: {
      curly: "warn",
      "no-console": "warn",
      "no-debugger": "warn",
      "vue/multi-word-component-names": "off",
    },
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
  },
  prettierPlugin,
  {
    ignores: [
      "dist/*",
      // Our config doesn't handle the cjs correctly, we'll just skip this file
      "tailwind.config.cjs",
    ],
  },
];
