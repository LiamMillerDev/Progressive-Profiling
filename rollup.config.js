import terser from "@rollup/plugin-terser";

export default {
  input: "src/ml-multistep-form.js",
  output: [
    {
      file: "dist/ml-multistep-form.min.js",
      format: "iife",
      name: "MLMultiStepForm",
    },
    {
      file: "docs/ml-multistep-form.min.js",
      format: "iife",
      name: "MLMultiStepForm",
    },
  ],
  plugins: [terser()],
};
