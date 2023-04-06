import { WebpackBaseConfig } from './config/base';
import { createDevCompiler, createBuildCompiler } from "./compiler/compiler";
import rimraf from "rimraf";
import { mergeVueConfig } from "./frame/vue";

export const devCompiler = () => {
    const webpackDevConfig = new WebpackBaseConfig();

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
    const webpackBuildConfig = new WebpackBaseConfig();

    mergeVueConfig(webpackBuildConfig.config);

    const { configuration } = webpackBuildConfig;
    if (configuration.output && configuration.output.path) {
        rimraf.sync(configuration.output.path);
    }

    return createBuildCompiler({
        configuration
    });
}
