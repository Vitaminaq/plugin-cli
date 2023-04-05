import webpack from 'webpack';
import MFS from 'memory-fs';
import path from 'path';
import chalk from "chalk";
import { printStats } from "./stats";

interface DevCompiler {
    configuration: webpack.Configuration;
}

export const createDevCompiler = ({
    configuration,
}: DevCompiler) => {
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

    // const serverMfs = new MFS();

    // compiler.outputFileSystem = serverMfs as any;

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

        // const source = readFile(serverMfs, 'index.js');

        // socket.send(source);
    });

    return compiler;
}

export const createBuildCompiler = ({
    configuration,
}: DevCompiler) => {
    const compiler = webpack(configuration);

    compiler.run((err, stats) => {
        printStats(err, stats);
        compiler.close(() => {
            console.log("编译完成")
        })
    })
}
