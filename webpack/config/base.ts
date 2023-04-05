import Config from 'webpack-chain';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackBar from 'webpackbar';
import path from "path";
import HtmlInlineScriptPlugin from '../plugin/html-inline-scripts';

const root = process.cwd();

export class WebpackBaseConfig {
    public config = new Config();

    public constructor() {
        const { config } = this;
        config
            .entry("ui")
            .add("./src/index.ts")
            .end()
            .entry("core")
            .add("./core.ts")
            .end()
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
        this.injectPlugins();
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
         config
            .module
            .rule('css')
            .test(/\.css$/i)
            .use('css-loader')
            .loader(require.resolve('css-loader'))

        config
            .module
            .rule('css')
            .test(/\.css$/i)
            .use('esbuild-loader')
            .loader(require.resolve('esbuild-loader'))
            .options({
                minify: true,
                implementation: require("esbuild")
            });
    }

    public injectPlugins() {
        this.config
            .plugin('progress')
            .use(WebpackBar, [{
                name: 'plugin',
                color: 'green'
            }])
            .end()
            .plugin('html')
            .use(HtmlWebpackPlugin, [{
                template: "ui.html",
                filename: "ui.html",
                cache: false,
            }])
            .end()
            .plugin('inline-script')
            .use(HtmlInlineScriptPlugin, [{
                scriptMatchPattern: [/ui.js$/],
                htmlMatchPattern: [/ui.html$/],
                ignoredScriptMatchPattern: [/core.js$/]
            }])
            .end();
    }
}
