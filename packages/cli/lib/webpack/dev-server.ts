import webpack from "webpack";
import express from "express";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import { servicePort } from "../config";
import { pluginScoket } from './middleware';
import { WebpackUIConfig } from "./config";
import { compilerUI } from "./compiler/compiler";

export const setupUIDevServer = () => {
    const app = express();

    const config = new WebpackUIConfig().configuration;

    config.plugins?.push(new webpack.HotModuleReplacementPlugin());

    (config as any).entry.ui = [
        'webpack-hot-middleware/client',
		...(config as any).entry.ui
    ];

    const compiler = compilerUI(config);
    if (!compiler) return;

    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output?.publicPath,
        stats: 'none',
        index: 'ui.html'
    }));

    app.use(webpackHotMiddleware(compiler, {
        heartbeat: 5000
    }));

    const eWsApp = pluginScoket(app);

    eWsApp.listen(servicePort);
}

export const setupDevServer = () => {
    setupUIDevServer();
};
