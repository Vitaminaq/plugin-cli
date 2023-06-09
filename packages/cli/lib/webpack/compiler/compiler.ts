import webpack from "webpack";
import MFS from "memory-fs";
import path from "path";
import fs from "fs";
import chalk from "chalk";
import { printStats } from "./stats";
import { root, hooks, isBuild, localConfig } from "../../config";
import { watchFile } from "../../utils";

const readMFSFile = (fs: MFS, p: string, file: string) => {
  try {
    return fs.readFileSync(path.join(p, file), "utf-8");
  } catch (e) {
    console.log("read dist fail", e);
    return "";
  }
};

export const watchManifest = () =>
  watchFile("./manifest.json", () => {
    console.log(chalk.green("[plugin-cli]: "), "manifest.json");

    let str = "";
    try {
      str = fs.readFileSync(path.resolve(root, "./manifest.json"), {
        encoding: "utf8",
      });
    } catch (e) {
      str = "";
    }

    hooks.callHook("update", "manifest", str);
  });

export const watchMain = () => {
  if (!localConfig.main) return;

  return watchFile(localConfig.main, (p) => {
    console.log(chalk.green("[plugin-cli]: "), p);
    const mainCode = fs.readFileSync(
      path.resolve(root, localConfig.main || ""),
      "utf8"
    );
    hooks.callHook("update", "main", mainCode);
  });
};

export const compilerMain = (configuration: webpack.Configuration) => {
  const build = () => {
    const compiler = webpack(configuration);

    let serverMfs: MFS;
    if (!isBuild) {
      serverMfs = new MFS();
      compiler.outputFileSystem = serverMfs;
    }

    compiler.run((err, stats) => {
      printStats(err, stats, "Main");

      compiler.close(() => {
        if (isBuild) return console.log(chalk.green("Main build finished !!!"));
        const mainCode = readMFSFile(serverMfs, compiler.outputPath, "main.js");
        hooks.callHook("update", "main", mainCode);
      });
    });
  };
  if (isBuild) return build();

  if (!configuration.entry) return;
  watchFile((configuration.entry as any).main[0], build);
};

const uiHtml = `<html>
<head>
    <title>pixso plugin debug</title>
    <style>
      iframe {
        height: 100%;
        width: 100%;
      }
    </style>
</head>
<body><iframe src="http://localhost:5201"></iframe></body>
</html>`;

export const compilerUI = (configuration: webpack.Configuration) => {
  const compiler = webpack(configuration);

  if (isBuild)
    return compiler.run((err, stats) => {
      printStats(err, stats, "UI");
      compiler.close(() => {
        console.log(chalk.green("UI build finished !!!"));
      });
    });

  compiler.hooks.done.tap("pixso-plugin-cli", async (stats) => {
    if (!printStats(null, stats, "UI")) return;
    hooks.callHook("update", "ui", uiHtml);
  });

  compiler.hooks.failed.tap("pixso-plugin-cli", (error) => {
    console.log(chalk.red("Client compilation failed"));
    console.error(error);
  });
  return compiler;
};
