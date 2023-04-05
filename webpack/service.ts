import type { WebSocket } from 'ws';
import { WebpackDevConfig } from './config/dev';
import { WebpackBuildConfig } from './config/build';
import { createDevCompiler, createBuildCompiler } from "./compiler/compiler";
import rimraf from "rimraf";
import { mergeVueConfig } from "./frame/vue";

const config = {
    coreEntry: "./core.ts",
    uiEntry: "./src/index.ts"
}

export const devCompiler = (socket?: WebSocket) => {
    const webpackDevConfig = new WebpackDevConfig();

    mergeVueConfig(webpackDevConfig.config);

    const { configuration } = webpackDevConfig;
    if (configuration.output && configuration.output.path) {
        rimraf.sync(configuration.output.path);
    }

    return createDevCompiler({
        configuration
    });
}

export const buildCompiler = () => {
    const webpackBuildConfig = new WebpackBuildConfig();

    const { configuration } = webpackBuildConfig;
    if (configuration.output && configuration.output.path) {
        rimraf.sync(configuration.output.path);
    }

    return createBuildCompiler({
        configuration
    });
}
