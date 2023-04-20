import Config from 'webpack-chain';
import WebpackBar from 'webpackbar';
import path from "path";
import { root } from '../../config';

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

    public injectPlugins() {
        this.config
            .plugin('progress')
            .use(WebpackBar, [{
                name: 'plugin',
                color: 'green'
            }])
            .end();
    }
}
