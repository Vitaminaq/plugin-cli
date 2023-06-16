import { defineConfig } from "@pixso/plugin-cli-beta";
import { webpackPlugin } from "@pixso/svg-inline"

export default defineConfig({
    ui: './src/main.js',
    main: './src/code.ts',
    frame: 'svelte',
    template: './src/template.html',
    chainWebpack(config) {
        const svgRule = config.module.rule("svg");
        svgRule.uses.clear();
        return config;
    },
    configureWebpack(config) {
        config
            .plugins
            .push(
                webpackPlugin()
            );
    }
});
