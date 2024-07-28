import terser from "@rollup/plugin-terser";

export default {
  input: "src/progressiveflow.js",
  output: [
    {
      file: "dist/progressiveflow.js",
      format: "iife",
      name: "progressiveflow",
    },
    {
      file: "docs/progressiveflow.js",
      format: "iife",
      name: "progressiveflow",
    },
  ],
  plugins: [terser()],
};
