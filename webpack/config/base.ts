import Config from 'webpack-chain';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackBar from 'webpackbar';
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";

const root = process.cwd();

export class WebpackBaseConfig {
    public config = new Config();

    public constructor() {
        const { config } = this;
        config.resolve
            .extensions
            .merge(['.mjs', '.js', '.jsx', '.vue', '.json', '.wasm'])
            .end()
            .alias
            .set('@', path.resolve(root, "./src"));

        this.injectRules();
        this.injectPlugins();
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
                template: "index.html",
                filename: "index.html",
                // inject: false,
                cache: false,
            }])
            .end()
        // this.config.optimization.minimizer('js').use(EsbuildPlugin)
    }
}
