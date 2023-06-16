import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./index.ts"],
  clean: true,
  // dts: {
  //   entry: "./index.ts",
  // },
  external: [
    "unplugin"
  ],
});
