var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// package.json
var require_package = __commonJS({
  "package.json"(exports, module2) {
    module2.exports = {
      name: "@plugin/cli",
      version: "1.0.0",
      description: "plugin cli",
      bin: {
        "plugin-cli": "bin/plugin-cli.js"
      },
      main: "dist/index.js",
      scripts: {
        dev: "jiti dev-server",
        build: "tsup"
      },
      author: "",
      license: "ISC",
      devDependencies: {
        "@swc/core": "^1.3.44",
        "@swc/helpers": "^0.5.0",
        "@types/ws": "^8.5.4",
        c12: "^1.2.0",
        cac: "^6.7.14",
        chalk: "4.1.0",
        chokidar: "^3.5.3",
        "css-loader": "^6.7.3",
        esbuild: "^0.17.15",
        "esbuild-loader": "^3.0.1",
        "html-webpack-plugin": "^5.5.0",
        jiti: "^1.18.2",
        "memory-fs": "^0.5.0",
        rimraf: "^4.4.1",
        "style-loader": "^3.3.2",
        "svg-url-loader": "^8.0.0",
        "swc-loader": "^0.2.3",
        tsup: "^6.7.0",
        "url-loader": "^4.1.1",
        vue: "^3.2.47",
        "vue-loader": "^17.0.1",
        "vue-style-loader": "^4.1.3",
        webpack: "^5.77.0",
        "webpack-chain": "^6.5.1",
        webpackbar: "^5.0.2",
        ws: "^8.13.0"
      }
    };
  }
});

// index.ts
var import_cac = require("cac");

// lib/webpack/config/base.ts
var import_webpack_chain = __toESM(require("webpack-chain"));
var import_html_webpack_plugin2 = __toESM(require("html-webpack-plugin"));
var import_webpackbar = __toESM(require("webpackbar"));
var import_path = __toESM(require("path"));

// lib/webpack/plugin/html-inline-scripts.ts
var import_webpack = require("webpack");
var import_html_webpack_plugin = __toESM(require("html-webpack-plugin"));
var PLUGIN_PREFIX = "HtmlInlineScriptPlugin";
var HtmlInlineScriptPlugin = class {
  constructor(options = {}) {
    if (options && Array.isArray(options)) {
      console.error(
        "\x1B[35m%s \x1B[31m%s %s\x1B[0m",
        "[html-inline-script-webpack-plugin]",
        "Options is now an object containing `scriptMatchPattern` and `htmlMatchPattern` in version 3.x.",
        "Please refer to documentation for more information."
      );
      throw new Error("OPTIONS_PATTERN_UNMATCHED");
    }
    const {
      scriptMatchPattern = [/.+[.]js$/],
      htmlMatchPattern = [/.+[.]html$/],
      ignoredScriptMatchPattern = []
    } = options;
    this.scriptMatchPattern = scriptMatchPattern;
    this.htmlMatchPattern = htmlMatchPattern;
    this.ignoredScriptMatchPattern = ignoredScriptMatchPattern;
    this.processedScriptFiles = [];
    this.ignoredHtmlFiles = [];
  }
  isFileNeedsToBeInlined(assetName) {
    return this.scriptMatchPattern.some((test) => assetName.match(test));
  }
  isIgnoreInjectScript(src) {
    return this.ignoredScriptMatchPattern.some((test) => src.match(test));
  }
  shouldProcessHtml(templateName) {
    return this.htmlMatchPattern.some((test) => templateName.match(test));
  }
  processScriptTag(publicPath, assets, tag) {
    var _a;
    if (tag.tagName !== "script" || !((_a = tag.attributes) == null ? void 0 : _a.src)) {
      return tag;
    }
    const scriptName = decodeURIComponent(tag.attributes.src.replace(publicPath, ""));
    if (!this.isFileNeedsToBeInlined(scriptName)) {
      return tag;
    }
    const asset = assets[scriptName];
    if (!asset) {
      return tag;
    }
    const { src, ...attributesWithoutSrc } = tag.attributes;
    this.processedScriptFiles.push(scriptName);
    return {
      tagName: "script",
      innerHTML: asset.source().replace(/(<)(\/script>)/g, "\\x3C$2"),
      voidTag: false,
      attributes: attributesWithoutSrc,
      meta: { plugin: "html-inline-script-webpack-plugin" }
    };
  }
  apply(compiler) {
    var _a, _b;
    let publicPath = ((_b = (_a = compiler.options) == null ? void 0 : _a.output) == null ? void 0 : _b.publicPath) || "";
    if (publicPath && !publicPath.endsWith("/")) {
      publicPath += "/";
    }
    compiler.hooks.compilation.tap(`${PLUGIN_PREFIX}_compilation`, (compilation) => {
      const hooks = import_html_webpack_plugin.default.getHooks(compilation);
      hooks.alterAssetTags.tap(`${PLUGIN_PREFIX}_alterAssetTags`, (data) => {
        var _a2;
        const htmlFileName = (_a2 = data.plugin.options) == null ? void 0 : _a2.filename;
        if (htmlFileName && !this.shouldProcessHtml(htmlFileName)) {
          this.ignoredHtmlFiles.push(htmlFileName);
          return data;
        }
        data.assetTags.scripts = data.assetTags.scripts.filter((tag) => {
          return !this.isIgnoreInjectScript(tag.attributes.src);
        }).map(
          (tag) => this.processScriptTag(publicPath, compilation.assets, tag)
        );
        return data;
      });
      compilation.hooks.processAssets.tap({
        name: `${PLUGIN_PREFIX}_PROCESS_ASSETS_STAGE_SUMMARIZE`,
        stage: import_webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
      }, (assets) => {
        if (this.ignoredHtmlFiles.length === 0) {
          this.processedScriptFiles.forEach((assetName) => {
            delete assets[assetName];
          });
        }
      });
    });
  }
};
var html_inline_scripts_default = HtmlInlineScriptPlugin;

// lib/config.ts
var root = process.cwd();

// lib/webpack/config/base.ts
var WebpackBaseConfig = class {
  constructor() {
    this.config = new import_webpack_chain.default();
    const { config } = this;
    config.mode("production").devtool(false);
    config.optimization.usedExports(false);
    config.entry("ui").add("./src/index.ts").end().entry("core").add("./core.ts").end();
    config.output.path(import_path.default.resolve(root, "./dist")).end();
    config.resolve.extensions.merge([".mjs", ".js", ".jsx", ".vue", ".json", ".wasm"]).end().alias.set("@", import_path.default.resolve(root, "./src"));
    this.injectRules();
    this.injectPlugins();
  }
  get configuration() {
    return this.config.toConfig();
  }
  injectRules() {
    const { config } = this;
    config.module.rule("js").test(/\.(j|t)s$/).use("swc").loader(require.resolve("swc-loader")).options({
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
        }
      },
      minify: false
    });
    config.module.rule("js").test(/\.(j|t)sx?$/).use("swc").loader(require.resolve("swc-loader")).options({
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
        }
      },
      minify: true
    });
    config.module.rule("css").test(/\.css$/i).use("style-loader").loader(require.resolve("style-loader")).end().use("css-loader").loader(require.resolve("css-loader")).end().use("esbuild-loader").loader(require.resolve("esbuild-loader")).options({
      loader: "css",
      minify: true,
      implementation: require("esbuild")
    });
    config.module.rule("images").test(/\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/).use("url-loader").loader(require.resolve("url-loader")).options({
      limit: 1e6
    }).end();
    config.module.rule("svg").test(/\.svg(\?.*)?$/).use("svg-url-loader").loader(require.resolve("svg-url-loader")).options({
      encoding: "base64"
    }).end();
  }
  injectPlugins() {
    this.config.plugin("progress").use(import_webpackbar.default, [{
      name: "plugin",
      color: "green"
    }]).end().plugin("html").use(import_html_webpack_plugin2.default, [{
      template: "ui.html",
      filename: "ui.html",
      inject: "body",
      cache: false
    }]).end().plugin("inline-script").use(html_inline_scripts_default, [{
      scriptMatchPattern: [/ui.js$/],
      htmlMatchPattern: [/ui.html$/],
      ignoredScriptMatchPattern: [/core.js$/]
    }]).end();
  }
};

// lib/webpack/compiler/compiler.ts
var import_webpack2 = __toESM(require("webpack"));
var import_memory_fs = __toESM(require("memory-fs"));
var import_path2 = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
var import_chalk2 = __toESM(require("chalk"));
var import_chokidar = __toESM(require("chokidar"));

// lib/webpack/compiler/stats.ts
var import_chalk = __toESM(require("chalk"));
var printStats = (err, stats) => {
  var _a, _b;
  if (err) {
    console.log(import_chalk.default.red("Server critical error"));
    throw err;
  }
  if (!stats)
    return false;
  const jsonStats = stats.toJson();
  if (stats.hasErrors()) {
    (_a = jsonStats.errors) == null ? void 0 : _a.forEach((err2) => {
      const { stack, details, message } = err2;
      const error = stack || details || message;
      console.error(`${import_chalk.default.red("[Error]: ")}${error}`);
    });
  }
  if (stats.hasWarnings()) {
    (_b = jsonStats.warnings) == null ? void 0 : _b.forEach((err2) => {
      const { stack, details, message } = err2;
      const warn = stack || details || message;
      console.warn(`${import_chalk.default.yellow("[Warning]: ")}${warn}`);
    });
  }
  if (stats.hasErrors())
    return false;
  return true;
};

// lib/dev-server/server.ts
var import_ws = require("ws");
var DevServer = class {
  constructor() {
    this.pool = [];
    this.messages = /* @__PURE__ */ new Map();
    const wss = new import_ws.WebSocketServer({ port: 3e3 });
    wss.on("connection", (socket) => {
      this.pool.push(socket);
      this.messages.forEach((content, name) => {
        socket.send(JSON.stringify({ name, content }));
      });
      socket.on("message", (raw) => {
        console.log("========= message =======", raw);
      });
      socket.on("error", (err) => {
        console.log("========== error ============", err);
      });
      socket.send(JSON.stringify({ type: "connected" }));
    });
    wss.on("error", (e) => {
      console.log("========= wss error ==========", e);
    });
  }
  static get instance() {
    if (!DevServer._instance) {
      DevServer._instance = new DevServer();
    }
    return DevServer._instance;
  }
  update(name, content) {
    this.messages.set(name, content);
    this.pool.forEach((socket) => socket.send(JSON.stringify({
      name,
      content
    })));
  }
};

// lib/webpack/compiler/compiler.ts
var updateManifest = () => {
  let str = "";
  try {
    str = import_fs.default.readFileSync(import_path2.default.resolve(root, "./manifest.json"), { encoding: "utf-8" });
  } catch (e) {
    str = "";
  }
  DevServer.instance.update("manifest", str);
};
var createDevCompiler = ({
  configuration
}) => {
  const compiler = (0, import_webpack2.default)(configuration);
  const readFile = (fs2, file) => {
    try {
      return fs2.readFileSync(
        import_path2.default.join(compiler.outputPath, file),
        "utf-8"
      );
    } catch (e) {
      console.log("read dist fail", e);
      return "";
    }
  };
  const serverMfs = new import_memory_fs.default();
  compiler.outputFileSystem = serverMfs;
  import_chokidar.default.watch("./manifest.json").on("add", () => {
    console.log(import_chalk2.default.green("[plugin-cli]: "), "manifest.json created");
    updateManifest();
  }).on("change", () => {
    console.log(import_chalk2.default.green("[plugin-cli]: "), "manifest.json change");
    updateManifest();
  }).on("unlink", () => {
    console.log(import_chalk2.default.green("[plugin-cli]: "), "manifest.json unlink");
    updateManifest();
  });
  compiler.watch({}, (err, stats) => {
    var _a, _b;
    if (err) {
      console.log(import_chalk2.default.red("Server critical error"));
      throw err;
    }
    if (!stats)
      return;
    const jsonStats = stats.toJson();
    if (stats.hasErrors()) {
      (_a = jsonStats.errors) == null ? void 0 : _a.forEach((err2) => {
        const { stack, details, message } = err2;
        const error = stack || details || message;
        console.error(`${import_chalk2.default.red("[Error]: ")}${error}`);
      });
    }
    if (stats.hasWarnings()) {
      (_b = jsonStats.warnings) == null ? void 0 : _b.forEach((err2) => {
        const { stack, details, message } = err2;
        const warn = stack || details || message;
        console.warn(`${import_chalk2.default.yellow("[Warning]: ")}${warn}`);
      });
    }
    if (stats.hasErrors())
      return;
    const uiHtml = readFile(serverMfs, "ui.html");
    const core = readFile(serverMfs, "core.js");
    DevServer.instance.update("ui-html", uiHtml);
    DevServer.instance.update("core", core);
  });
  return compiler;
};
var createBuildCompiler = ({
  configuration
}) => {
  const compiler = (0, import_webpack2.default)(configuration);
  compiler.run((err, stats) => {
    printStats(err, stats);
    compiler.close(() => {
      console.log(import_chalk2.default.green("build finished !!!"));
    });
  });
};

// lib/webpack/service.ts
var import_rimraf = __toESM(require("rimraf"));

// lib/webpack/frame/vue.ts
var mergeVueConfig = (config) => {
  config.module.rule("vue").test(/\.vue$/).use("vue-loader").loader(require.resolve("vue-loader"));
  config.plugin("vue-loader").use(require("vue-loader").VueLoaderPlugin);
  config.module.rules.get("css").uses.delete("style-loader");
  config.module.rule("css").test(/\.css$/i).use("vue-style-loader").loader(require.resolve("vue-style-loader")).before("css-loader").end();
};

// lib/webpack/service.ts
var devCompiler = () => {
  const webpackDevConfig = new WebpackBaseConfig();
  mergeVueConfig(webpackDevConfig.config);
  const { configuration } = webpackDevConfig;
  if (configuration.output && configuration.output.path) {
    import_rimraf.default.sync(configuration.output.path);
  }
  return createDevCompiler({
    configuration
  });
};
var buildCompiler = () => {
  const webpackBuildConfig = new WebpackBaseConfig();
  mergeVueConfig(webpackBuildConfig.config);
  const { configuration } = webpackBuildConfig;
  if (configuration.output && configuration.output.path) {
    import_rimraf.default.sync(configuration.output.path);
  }
  return createBuildCompiler({
    configuration
  });
};

// lib/index.ts
var devServer = () => {
  devCompiler();
  DevServer.instance;
};

// index.ts
var cli = (0, import_cac.cac)("plugin-cli");
cli.command("[root]").alias("dev").action(() => {
  devServer();
});
cli.command("build [root]").action(() => {
  buildCompiler();
});
cli.help();
cli.version(require_package().version);
cli.parse();
