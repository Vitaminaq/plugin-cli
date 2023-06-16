import webpack from "webpack";
import express from "express";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import { servicePort } from "../config";
import { pluginScoket } from './middleware';
import { compilerUI } from "./compiler/compiler";

export const setupDevServer = (config: webpack.Configuration) => {
    const app = express();

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
