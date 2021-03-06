module.exports = {
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: ["dist/**/*"],
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "@vue/prettier",
  ],
  plugins: [],
  rules: {
    curly: "warn",
    "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
    "vue/multi-word-component-names": "off",
  },
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile: false,
  },
};
