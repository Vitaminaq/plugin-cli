import { WebpackUIConfig, WebpackMainConfig } from './config';
import { compilerMain, compilerUI, watchManifest, watchMain } from "./compiler/compiler";
import rimraf from "rimraf";
import { localConfig, isBuild } from "../config";

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

        if (uiConfiguration.output && uiConfiguration.output.path) {
            rimraf.sync(uiConfiguration.output.path);
        }
        compilerUI(uiConfiguration);
    }

    !isBuild && watchManifest();
}
