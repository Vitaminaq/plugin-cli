import type { WebSocket } from 'ws';
import { WebpackDevConfig } from './config/dev';
import { createDevCompiler } from "./compiler/dev-compiler";
import rimraf from "rimraf";

const config = {
    coreEntry: "./core.ts",
    uiEntry: "./src/index.ts"
}

export const createCompiler = (socket?: WebSocket) => {
    const webpackDevConfig = new WebpackDevConfig();

    const { configuration } = webpackDevConfig;
    if (configuration.output && configuration.output.path) {
        rimraf.sync(configuration.output.path);
    }
    
    console.log(configuration);

    const compiler = createDevCompiler({
        configuration
    });
}
