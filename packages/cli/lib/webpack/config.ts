import Config from "webpack-chain";
import WebpackBar from "webpackbar";
import path from "path";
import { root, localConfig, isBuild } from "../config";
import HtmlWebpackPlugin from "html-webpack-plugin";
import HtmlInlineScriptPlugin from "./plugin/html-inline-scripts";
import { mergeVueConfig } from "./frame/vue";
import { mergeSvelteConfig } from "./frame/svelte";

export class WebpackBaseConfig {
  public config = new Config();

  public constructor() {
    const { config } = this;
    config
      .mode(isBuild ? "production" : "development")
      .devtool(isBuild ? false : "inline-source-map");

    config
      .optimization
      .usedExports(false)
      .end();

    config
      .output
      .path(path.resolve(root, "./dist"))
      .clear()
      .end();

    config
      .resolve
      .extensions
      .merge([".ts", ".tsx", ".mjs", ".js", ".jsx", ".vue", ".json", ".wasm"])
      .end()
      .alias
      .set("@", path.resolve(root, "./src"));

    isBuild && config.performance
      .hints(false)
      .maxAssetSize(100000000)
      .maxEntrypointSize(100000000)
      .end();

    this.injectRules();

    isBuild && this.terser();
  }

  public get configuration() {
    return this.config.toConfig();
  }

  public injectRules() {
    const { config } = this;
    config.module
      .rule("js")
      .test(/\.(j|t)sx?$/)
      .exclude
      .add(/node_modules/)
      .end()
      .use("swc")
      .loader(require.resolve("swc-loader"))
      .options({
        jsc: {
          parser: {
            syntax: "typescript",
            jsx: true,
            tsx: true,
            target: "es2015",
          },
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
            react: {
              pragma: "React.createElement",
              pragmaFrag: "React.Fragment",
              throwIfNamespace: true,
              development: false,
              useBuiltins: false,
            },
          },
        },
        minify: isBuild,
      });
    config.module
      .rule("css")
      .test(/\.css$/i)
      .use("style-loader")
      .loader(require.resolve("style-loader"))
      .end()
      .use("css-loader")
      .loader(require.resolve("css-loader"))
      .end()
      .use("esbuild-loader")
      .loader(require.resolve("esbuild-loader"))
      .options({
        loader: "css",
        minify: true,
        implementation: require("esbuild"),
      });

    config.module
      .rule("images")
      .test(/\.(png|jpe?g|gif|webp|avif)(\?.*)?$/)
      .use("url-loader")
      .loader(require.resolve("url-loader"))
      .options({
        limit: isBuild ? 100000000 : 100,
      })
      .end();
    config.module
      .rule("svg")
      .test(/\.svg(\?.*)?$/)
      .use("svg-url-loader")
      .loader(require.resolve("svg-url-loader"))
      .options({
        encoding: isBuild ? "base64" : "none",
      })
      .end();
  }

  public terser() {
    const TerserPlugin = require("terser-webpack-plugin");
    this.config.optimization
      .minimizer("terser")
      .use(TerserPlugin, [
        {
          minify: TerserPlugin.swcMinify,
          terserOptions: {
            compress: {
              unused: true,
            },
            mangle: true,
          },
          parallel: true,
        },
      ])
      .end();
  }
}

export class WebpackMainConfig extends WebpackBaseConfig {
  public constructor() {
    super();
    const { config } = this;
    config
      .entry("main")
      .add(localConfig.main || "")
      .end();
    config.plugin("progress").use(WebpackBar, [
      {
        name: "Main",
        color: "#555cfd",
      },
    ]);
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


    switch(frame) {
      case "vue":
        mergeVueConfig(config);
        break;
      case "svelte":
        mergeSvelteConfig(config);
        break;
      default:
        break;
    }

    chainWebpack && chainWebpack(config);
  }

  public injectPlugins() {
    this.config
      .plugin("progress")
      .use(WebpackBar, [
        {
          name: "UI",
          color: "green",
        },
      ])
      .end()
      .plugin("html")
      .use(HtmlWebpackPlugin, [
        {
          template: localConfig.template,
          filename: "ui.html",
          inject: "body",
          cache: false,
        },
      ])
      .end();

    isBuild &&
      this.config
        .plugin("inline-script")
        .use(HtmlInlineScriptPlugin, [
          {
            scriptMatchPattern: [/ui.js$/],
            htmlMatchPattern: [/ui.html$/],
            // ignoredScriptMatchPattern: [/main.js$/]
          },
        ])
        .end();
  }
}
