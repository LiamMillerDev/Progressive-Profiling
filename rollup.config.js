import terser from "@rollup/plugin-terser";

export default {
  input: "src/progressive-flow.js",
  output: [
    {
      file: "dist/progressive-flow.min.js",
      format: "iife",
      name: "ProgressiveFlow",
    },
    {
      file: "docs/progressive-flow.min.js",
      format: "iife",
      name: "ProgressiveFlow",
    },
  ],
  plugins: [terser()],
};
