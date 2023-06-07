import { WebpackUIConfig, WebpackMainConfig } from './config';
import { compilerMain, compilerUI, watchManifest, watchMain } from "./compiler/compiler";
import rimraf from "rimraf";
import { localConfig, isBuild } from "../config";
import { setupDevServer } from './dev-server';

export const compiler = () => {
    const uiConfig = new WebpackUIConfig();
    const mainConfig = new WebpackMainConfig();

    const { ui, mainBuild } = localConfig;

    const { configuration: mainConfiguration } = mainConfig;
    if (mainConfiguration.output && mainConfiguration.output.path) {
        rimraf.sync(mainConfiguration.output.path);
    }

    mainBuild ? compilerMain(mainConfiguration) : watchMain();

    if (ui) {
        const { configuration: uiConfiguration } = uiConfig;
        isBuild ? compilerUI(uiConfiguration) : setupDevServer();
    }

    !isBuild && watchManifest();
}


