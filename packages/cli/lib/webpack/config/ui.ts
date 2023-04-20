import HtmlWebpackPlugin from 'html-webpack-plugin';
import { WebpackBaseConfig } from './base';
import HtmlInlineScriptPlugin from '../plugin/html-inline-scripts';
import { localConfig } from "../../config";

export class WebpackUIConfig extends WebpackBaseConfig {
    public constructor() {
        super();
        if (!localConfig.ui) return;
        const { config } = this;
        config
            .entry("ui")
            .add(localConfig.ui)
            .end();
    }

    public injectPlugins() {
        this.config
            .plugin('html')
            .use(HtmlWebpackPlugin, [{
                template: "ui.html",
                filename: "ui.html",
                inject: 'body',
                cache: false,
            }])
            .end()
            .plugin('inline-script')
            .use(HtmlInlineScriptPlugin, [{
                scriptMatchPattern: [/ui.js$/],
                htmlMatchPattern: [/ui.html$/],
                // ignoredScriptMatchPattern: [/main.js$/]
            }])
            .end();
    }
}
