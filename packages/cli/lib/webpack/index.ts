import { WebpackUIConfig, WebpackMainConfig } from './config';
import { compilerMain, compilerUI, watchManifest, watchMain } from "./compiler/compiler";
import rimraf from "rimraf";
import { localConfig, isBuild } from "../config";
import { setupDevServer } from './dev-server';
import { merge } from "webpack-merge";

export const compiler = () => {
    const uiConfig = new WebpackUIConfig();
    const mainConfig = new WebpackMainConfig();

    const { ui, mainBuild, configureWebpack } = localConfig;

    const { configuration: mainConfiguration } = mainConfig;
    if (mainConfiguration.output && mainConfiguration.output.path) {
        rimraf.sync(mainConfiguration.output.path);
    }

    mainBuild ? compilerMain(mainConfiguration) : watchMain();

    if (ui) {
        let { configuration: uiConfiguration } = uiConfig;
        if (typeof configureWebpack === 'function') {
            configureWebpack(uiConfiguration)
        } else {
            uiConfiguration = merge(uiConfiguration, configureWebpack || {});
        }
        isBuild ? compilerUI(uiConfiguration) : setupDevServer(uiConfiguration);
    }

    !isBuild && watchManifest();
}


