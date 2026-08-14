module.exports = {
  root: true,
  env: { browser: true, node: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh"],
  rules: {
    // no component in this codebase uses the PropTypes runtime; JSDoc is the convention
    "react/prop-types": "off",
    // react-three-fiber JSX props (intensity, args, ...) are not DOM attributes
    "react/no-unknown-property": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
};
