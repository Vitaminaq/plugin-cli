import { localConfig } from "./config";
import { buildCompiler } from './webpack/service';
import { devCompiler } from './webpack/service';

export const devMain = () => {
    if (!localConfig.mainBuild) return;
}

export const buildMain = () => {
    if (!localConfig.mainBuild) return;
}

export const devUI = () => {
    if (!localConfig.ui) return;
    devCompiler();
}

export const buildUI = () => {
    if (!localConfig.ui) return;
    buildCompiler();
}

export const watchManifest = () => {

}
