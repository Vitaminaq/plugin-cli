import webpack from 'webpack';
import MFS from 'memory-fs';
import path from 'path';
import fs from 'fs';
import chalk from "chalk";
import chokidar from "chokidar";
import { printStats } from "./stats";
import { root } from '../../config';
import { DevServer } from '../../dev-server/server';

const readMFSFile = (fs, path, file) => {
    try {
        return fs.readFileSync(
            path.join(path, file),
            'utf-8'
        );
    } catch (e) {
        console.log("read dist fail", e);
        return '';
    }
};

const updateManifest = () => {
    let str = '';
    try {
       str = fs.readFileSync(path.resolve(root, "./manifest.json"), { encoding: 'utf-8' })
    } catch(e) {
        str = '';
    }

    DevServer.instance.update('manifest', str);
}

const watchManifest = () => {
    return chokidar
        .watch("./manifest.json")
        .on("add", () => {
            console.log(chalk.green("[plugin-cli]: "), 'manifest.json created');
            updateManifest();
        })
        .on("change", () => {
            console.log(chalk.green("[plugin-cli]: "), 'manifest.json change');
            updateManifest();
        })
        .on("unlink", () => {
            console.log(chalk.green("[plugin-cli]: "), 'manifest.json unlink');
            updateManifest();
        });
}

export const compilerMain = ({
    configuration,
}: CompilerOptions) => {
    const compiler = webpack(configuration);

    const serverMfs = new MFS();

    compiler.outputFileSystem = serverMfs as any;

    compiler.run((err, stats) => {
        printStats(err, stats);
        compiler.close(() => {
            const mainCode = readMFSFile(serverMfs, compiler.outputPath, 'main.js');
            DevServer.instance.update('main', mainCode);
        });
    });
}

interface CompilerOptions {
    configuration: webpack.Configuration;
}

export const createDevCompiler = ({
    configuration
}: CompilerOptions) => {
    const compiler = webpack(configuration);

    const serverMfs = new MFS();

    compiler.outputFileSystem = serverMfs as any;

    watchManifest();

    compiler.watch({}, (err, stats) => {
        if (err) {
            console.log(chalk.red('Server critical error'));
            throw err;
        }

        if (!stats) return;

        const jsonStats = stats.toJson();
        if (stats.hasErrors()) {
            jsonStats.errors?.forEach((err) => {
                const { stack, details, message } = err;
                const error = stack || details || message;
                console.error(`${chalk.red('[Error]: ')}${error}`)
            });
            // jsonStats.errors?.forEach((err) => console.error(err));
        }
        if (stats.hasWarnings()) {
            jsonStats.warnings?.forEach((err) => {
                const { stack, details, message } = err;
                const warn = stack || details || message;
                console.warn(`${chalk.yellow('[Warning]: ')}${warn}`)
            });
        }

        if (stats.hasErrors()) return;

        const uiHtml = readMFSFile(serverMfs, compiler.outputPath, 'ui.html');

        DevServer.instance.update('ui-html', uiHtml);
    });

    return compiler;
}

export const createBuildCompiler = ({
    configuration,
}: CompilerOptions) => {
    const compiler = webpack(configuration);

    compiler.run((err, stats) => {
        printStats(err, stats);
        compiler.close(() => {
            console.log(chalk.green("build finished !!!"));
        });
    });
}
