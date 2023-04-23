import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ["./index.ts"],
    clean: true,
    external: ["cac", "chokidar", "memory-fs", "chalk", "webpack", "swc-loader", "vue-style-loader", "vue-loader", "esbuild-loader", "url-loader", "svg-url-loader", "css-loader", "style-loader", "html-webpack-plugin", "esbuild", "webpack-chain", "webpackbar", "ws", "rimraf", "hookable", "c12"]
});
