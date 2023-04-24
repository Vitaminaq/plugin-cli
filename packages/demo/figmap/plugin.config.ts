import { defineConfig } from "@pixso/plugin-cli-beta";

export default defineConfig({
    ui: './src/app/index.tsx',
    main: './src/plugin/controller.ts',
    frame: 'react',
    template: './src/app/index.html'
});
