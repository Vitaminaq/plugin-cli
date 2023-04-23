import Config from 'webpack-chain';
import WebpackBar from 'webpackbar';
import path from "path";
import { root, localConfig } from '../config';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlInlineScriptPlugin from './plugin/html-inline-scripts';
import { mergeVueConfig } from "./frame/vue";

export class WebpackBaseConfig {
    public config = new Config();

    public constructor() {
        const { config } = this;
        config
            .mode("production")
            .devtool(false);
        config
            .optimization
            .usedExports(false);
        config.output
            .path(path.resolve(root, "./dist"))
            .end();
        config.resolve
            .extensions
            .merge(['.mjs', '.js', '.jsx', '.vue', '.json', '.wasm'])
            .end()
            .alias
            .set('@', path.resolve(root, "./src"));

        this.injectRules();
    }

    public get configuration() {
        return this.config.toConfig();
    }

    public injectRules() {
        const { config } = this;
        config
            .module
            .rule('js')
            .test(/\.(j|t)s$/)
            .use('swc')
            .loader(require.resolve("swc-loader"))
            .options({
                jsc: {
                    parser: {
                        syntax: "typescript",
                        jsx: true,
                        tsx: true,
                        target: "es2015"
                    },
                    transform: {
                        legacyDecorator: true,
                        decoratorMetadata: true
                    },
                },
                minify: false,
            });
        config
            .module
            .rule('js')
            .test(/\.(j|t)sx?$/)
            .use('swc')
            .loader(require.resolve("swc-loader"))
            .options({
                jsc: {
                    parser: {
                        syntax: "typescript",
                        jsx: true,
                        tsx: true,
                        target: "es2015"
                    },
                    transform: {
                        legacyDecorator: true,
                        decoratorMetadata: true
                    },
                },
                minify: true,
            });
        config
            .module
            .rule('css')
            .test(/\.css$/i)
            .use('style-loader')
            .loader(require.resolve('style-loader'))
            .end()
            .use('css-loader')
            .loader(require.resolve('css-loader'))
            .end()
            .use('esbuild-loader')
            .loader(require.resolve('esbuild-loader'))
            .options({
                loader: 'css',
                minify: true,
                implementation: require("esbuild")
            });

        config
            .module
            .rule('images')
            .test(/\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/)
            .use('url-loader')
            .loader(require.resolve('url-loader'))
            .options({
                limit: 1000000
            })
            .end();
        config
            .module
            .rule('svg')
            .test(/\.svg(\?.*)?$/)
            .use('svg-url-loader')
            .loader(require.resolve('svg-url-loader'))
            .options({
                encoding: "base64"
            })
            .end();
    }
}

export class WebpackMainConfig extends WebpackBaseConfig {
    public constructor() {
        super();
        const { config } = this;
        config
            .entry("main")
            .add(localConfig.main)
            .end();
        config.plugin('progress')
            .use(WebpackBar, [{
                name: 'Main',
                color: '#555cfd'
            }]);
    }
}

export class WebpackUIConfig extends WebpackBaseConfig {
    public constructor() {
        super();
        const { ui, chainWebpack, frame } = localConfig;
        if (!ui) return;
        const { config } = this;
        config
            .entry("ui")
            .add(ui)
            .end();
        this.injectPlugins();

        if (frame === 'vue') {
            mergeVueConfig(config);
        }

        chainWebpack && chainWebpack(config);
    }

    public injectPlugins() {
        this.config
            .plugin('progress')
            .use(WebpackBar, [{
                name: 'UI',
                color: 'green'
            }])
            .end()
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
