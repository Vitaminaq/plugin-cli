import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./lib/index.ts", "./lib/cli.ts"],
  clean: true,
  dts: {
    entry: "./lib/index.ts",
  },
  external: [
    "cac",
    "chokidar",
    "memory-fs",
    "chalk",
    "webpack",
    "swc-loader",
    "vue-style-loader",
    "vue-loader",
    "esbuild-loader",
    "url-loader",
    "svg-url-loader",
    "css-loader",
    "style-loader",
    "html-webpack-plugin",
    "esbuild",
    "webpack-chain",
    "webpackbar",
    "ws",
    "rimraf",
    "hookable",
    "c12",
    "webpack-dev-middleware",
    "webpack-hot-middleware",
    "express"
  ],
});
