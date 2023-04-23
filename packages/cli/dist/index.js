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
        dev: "jiti index.ts",
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
      },
      dependencies: {
        hookable: "^5.5.3"
      }
    };
  }
});

// index.ts
var import_cac = require("cac");

// lib/dev-server/server.ts
var import_ws = require("ws");

// lib/config.ts
var import_c12 = require("c12");
var import_hookable = require("hookable");
var root = process.cwd();
var localConfig = {
  main: "./main.ts",
  manifest: "./manifest.json",
  frame: "vue"
};
var loadUserConfig = async () => {
  const { config } = await (0, import_c12.loadConfig)({
    name: "plugin",
    configFile: "plugin.config",
    rcFile: ".pluginrc",
    dotenv: true,
    globalRc: true
  });
  if (!config)
    return;
  Object.assign(localConfig, config);
};
var isBuild = process.env.NODE_ENV === "production";
var hooks = (0, import_hookable.createHooks)();

// lib/dev-server/server.ts
var DevServer = class {
  // 更新队列
  constructor() {
    this.pool = [];
    // socket池
    this.messages = /* @__PURE__ */ new Map();
    // 构建产物池
    this.updates = [];
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
    this.subUpdate();
  }
  static get instance() {
    if (!DevServer._instance) {
      DevServer._instance = new DevServer();
    }
    return DevServer._instance;
  }
  subUpdate() {
    return hooks.hook("update", (name, content) => {
      const msg = this.messages.get(name);
      if (msg && msg === content)
        return;
      this.messages.set(name, content);
      this.pool.forEach((socket) => socket.send(JSON.stringify({
        name,
        content
      })));
    });
  }
};

// lib/webpack/config.ts
var import_webpack_chain = __toESM(require("webpack-chain"));
var import_webpackbar = __toESM(require("webpackbar"));
var import_path = __toESM(require("path"));
var import_html_webpack_plugin2 = __toESM(require("html-webpack-plugin"));

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
  apply(compiler2) {
    var _a, _b;
    let publicPath = ((_b = (_a = compiler2.options) == null ? void 0 : _a.output) == null ? void 0 : _b.publicPath) || "";
    if (publicPath && !publicPath.endsWith("/")) {
      publicPath += "/";
    }
    compiler2.hooks.compilation.tap(`${PLUGIN_PREFIX}_compilation`, (compilation) => {
      const hooks2 = import_html_webpack_plugin.default.getHooks(compilation);
      hooks2.alterAssetTags.tap(`${PLUGIN_PREFIX}_alterAssetTags`, (data) => {
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

// lib/webpack/frame/vue.ts
var mergeVueConfig = (config) => {
  config.module.rule("vue").test(/\.vue$/).use("vue-loader").loader(require.resolve("vue-loader"));
  config.plugin("vue-loader").use(require("vue-loader").VueLoaderPlugin);
  config.module.rules.get("css").uses.delete("style-loader");
  config.module.rule("css").test(/\.css$/i).use("vue-style-loader").loader(require.resolve("vue-style-loader")).before("css-loader").end();
};

// lib/webpack/config.ts
var WebpackBaseConfig = class {
  constructor() {
    this.config = new import_webpack_chain.default();
    const { config } = this;
    config.mode("production").devtool(false);
    config.optimization.usedExports(false);
    config.output.path(import_path.default.resolve(root, "./dist")).end();
    config.resolve.extensions.merge([".mjs", ".js", ".jsx", ".vue", ".json", ".wasm"]).end().alias.set("@", import_path.default.resolve(root, "./src"));
    this.injectRules();
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
};
var WebpackMainConfig = class extends WebpackBaseConfig {
  constructor() {
    super();
    const { config } = this;
    config.entry("main").add(localConfig.main).end();
    config.plugin("progress").use(import_webpackbar.default, [{
      name: "Main",
      color: "#555cfd"
    }]);
  }
};
var WebpackUIConfig = class extends WebpackBaseConfig {
  constructor() {
    super();
    const { ui, chainWebpack, frame } = localConfig;
    if (!ui)
      return;
    const { config } = this;
    config.entry("ui").add(ui).end();
    this.injectPlugins();
    if (frame === "vue") {
      mergeVueConfig(config);
    }
    chainWebpack && chainWebpack(config);
  }
  injectPlugins() {
    this.config.plugin("progress").use(import_webpackbar.default, [{
      name: "UI",
      color: "green"
    }]).end().plugin("html").use(import_html_webpack_plugin2.default, [{
      template: "ui.html",
      filename: "ui.html",
      inject: "body",
      cache: false
    }]).end().plugin("inline-script").use(html_inline_scripts_default, [{
      scriptMatchPattern: [/ui.js$/],
      htmlMatchPattern: [/ui.html$/]
      // ignoredScriptMatchPattern: [/main.js$/]
    }]).end();
  }
};

// lib/webpack/compiler/compiler.ts
var import_webpack2 = __toESM(require("webpack"));
var import_memory_fs = __toESM(require("memory-fs"));
var import_path2 = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
var import_chalk2 = __toESM(require("chalk"));

// lib/webpack/compiler/stats.ts
var import_chalk = __toESM(require("chalk"));
var printStats = (err, stats, type) => {
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
      console.error(`${import_chalk.default.red(`[${type} Error]: `)}${error}`);
      console.error(`${import_chalk.default.red(`[${type} Error]: `)}${details}`);
      console.error(`${import_chalk.default.red(`[${type} Error]: `)}${message}`);
    });
  }
  if (stats.hasWarnings()) {
    (_b = jsonStats.warnings) == null ? void 0 : _b.forEach((err2) => {
      const { stack, details, message } = err2;
      const warn = stack || details || message;
      console.warn(`${import_chalk.default.yellow(`[${type} Warning]: `)}${warn}`);
    });
  }
  if (stats.hasErrors())
    return false;
  return true;
};

// lib/utils.ts
var import_chokidar = __toESM(require("chokidar"));
var watchFile = (path3, callback) => {
  return import_chokidar.default.watch(path3).on("add", callback).on("change", callback).on("unlink", callback);
};

// lib/webpack/compiler/compiler.ts
var readMFSFile = (fs2, p, file) => {
  try {
    return fs2.readFileSync(
      import_path2.default.join(p, file),
      "utf-8"
    );
  } catch (e) {
    console.log("read dist fail", e);
    return "";
  }
};
var watchManifest = () => watchFile("./manifest.json", () => {
  console.log(import_chalk2.default.green("[plugin-cli]: "), "manifest.json created");
  let str = "";
  try {
    str = import_fs.default.readFileSync(import_path2.default.resolve(root, "./manifest.json"), { encoding: "utf-8" });
  } catch (e) {
    str = "";
  }
  hooks.callHook("update", "manifest", str);
});
var compilerMain = (configuration) => {
  const compiler2 = (0, import_webpack2.default)(configuration);
  const build2 = () => {
    let serverMfs;
    if (!isBuild) {
      serverMfs = new import_memory_fs.default();
      compiler2.outputFileSystem = serverMfs;
    }
    compiler2.run((err, stats) => {
      printStats(err, stats, "Main");
      if (isBuild)
        return;
      compiler2.close(() => {
        const mainCode = readMFSFile(serverMfs, compiler2.outputPath, "main.js");
        hooks.callHook("update", "main", mainCode);
      });
    });
  };
  if (isBuild)
    return build2();
  console.log("compiler.compilerPath", compiler2.compilerPath, configuration);
  if (!configuration.entry)
    return;
  watchFile(configuration.entry.main[0], build2);
};
var compilerUI = (configuration) => {
  const compiler2 = (0, import_webpack2.default)(configuration);
  let serverMfs;
  if (!isBuild) {
    serverMfs = new import_memory_fs.default();
    compiler2.outputFileSystem = serverMfs;
  }
  if (isBuild)
    return compiler2.run((err, stats) => {
      printStats(err, stats, "UI");
      compiler2.close(() => {
        console.log(import_chalk2.default.green("build finished !!!"));
      });
    });
  return compiler2.watch({}, (err, stats) => {
    if (!printStats(err, stats, "UI"))
      return;
    const uiHtml = readMFSFile(serverMfs, compiler2.outputPath, "ui.html");
    hooks.callHook("update", "ui", uiHtml);
  });
};

// lib/webpack/service.ts
var import_rimraf = __toESM(require("rimraf"));
var compiler = () => {
  const uiConfig = new WebpackUIConfig();
  const mainConfig = new WebpackMainConfig();
  const { configuration: mainConfiguration } = mainConfig;
  if (mainConfiguration.output && mainConfiguration.output.path) {
    import_rimraf.default.sync(mainConfiguration.output.path);
  }
  compilerMain(mainConfiguration);
  if (localConfig.ui) {
    const { configuration: uiConfiguration } = uiConfig;
    if (uiConfiguration.output && uiConfiguration.output.path) {
      import_rimraf.default.sync(uiConfiguration.output.path);
    }
    compilerUI(uiConfiguration);
  }
  !isBuild && watchManifest();
};

// lib/index.ts
var devServer = async () => {
  await loadUserConfig();
  compiler();
  DevServer.instance;
};
var build = async () => {
  await loadUserConfig();
  compiler();
};

// index.ts
var cli = (0, import_cac.cac)("plugin-cli");
cli.command("[root]").alias("dev").action(() => {
  devServer();
});
cli.command("build [root]").action(() => {
  build();
});
cli.help();
cli.version(require_package().version);
cli.parse();
