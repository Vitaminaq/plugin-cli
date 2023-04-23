import { defineConfig } from "@plugin/cli";

export default defineConfig({
    ui: './src/index.ts',
    main: './main.js',
    mainBuild: false
});
