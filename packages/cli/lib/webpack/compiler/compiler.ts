import webpack from 'webpack';
import MFS from 'memory-fs';
import path from 'path';
import fs from 'fs';
import chalk from "chalk";
import chokidar from "chokidar";
import { printStats } from "./stats";
import type { WebSocket } from 'ws';
import { root } from '../../config';

interface SocketResponseItem {
    name: 'manifest' | 'ui-html' | 'core';
    content: string;
}

const updateManifest = (socket?: WebSocket) => {
    let str = '';
    try {
       str = fs.readFileSync(path.resolve(root, "./manifest.json"), { encoding: 'utf-8' })
    } catch(e) {
        str = '';
    }

    const res: SocketResponseItem[] = [{
        name: 'manifest',
        content: str
    }];

    socket?.send(JSON.stringify(res));
}

interface CompilerOptions {
    configuration: webpack.Configuration;
}

interface DevCompilerOptions extends CompilerOptions {
    socket?: WebSocket
}

export const createDevCompiler = ({
    configuration,
    socket
}: DevCompilerOptions) => {
    const compiler = webpack(configuration);

    const readFile = (fs, file) => {
        try {
            return fs.readFileSync(
                path.join(compiler.outputPath, file),
                'utf-8'
            );
        } catch (e) {
            console.log("read dist fail", e);
            return '';
        }
    };

    const serverMfs = new MFS();

    compiler.outputFileSystem = serverMfs as any;

    chokidar
        .watch("./manifest.json")
        .on("add", () => {
            console.log(chalk.green("[plugin-cli]: "), 'manifest.json created');
            updateManifest(socket);
        })
        .on("change", () => {
            console.log(chalk.green("[plugin-cli]: "), 'manifest.json change');
            updateManifest(socket);
        })
        .on("unlink", () => {
            console.log(chalk.green("[plugin-cli]: "), 'manifest.json unlink');
            updateManifest(socket);
        });

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

        const uiHtml = readFile(serverMfs, 'ui.html');
        const core = readFile(serverMfs, 'core.js');

        const res: SocketResponseItem[] = [{
            name: 'ui-html',
            content: uiHtml
        }, {
            name: 'core',
            content: core
        }];

        socket?.send(JSON.stringify(res));
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
