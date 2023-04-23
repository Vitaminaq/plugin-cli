import webpack from 'webpack';
import MFS from 'memory-fs';
import path from 'path';
import fs from 'fs';
import chalk from "chalk";
import { printStats } from "./stats";
import { root, hooks, isBuild } from '../../config';
import { watchFile } from "../../utils";

const readMFSFile = (fs, p, file) => {
    try {
        return fs.readFileSync(
            path.join(p, file),
            'utf-8'
        );
    } catch (e) {
        console.log("read dist fail", e);
        return '';
    }
};

export const watchManifest = () => watchFile("./manifest.json", () => {
    console.log(chalk.green("[plugin-cli]: "), 'manifest.json created');
    
    let str = '';
    try {
       str = fs.readFileSync(path.resolve(root, "./manifest.json"), { encoding: 'utf-8' })
    } catch(e) {
        str = '';
    }

    hooks.callHook('update', 'manifest', str);
});

export const compilerMain = (
    configuration: webpack.Configuration
) => {
    const compiler = webpack(configuration);

    const build = () => {
        let serverMfs;
        if (!isBuild) {
            serverMfs = new MFS();
            compiler.outputFileSystem = serverMfs as any;
        }
    
        compiler.run((err, stats) => {
            printStats(err, stats, 'Main');
            if (isBuild) return;
            compiler.close(() => {
                const mainCode = readMFSFile(serverMfs, compiler.outputPath, 'main.js');
                hooks.callHook('update', 'main', mainCode);
            });
        });
    }
    if (isBuild) return build();

    if (!configuration.entry) return;
    watchFile((configuration.entry as any).main[0], build);
}

export const compilerUI = (
    configuration: webpack.Configuration
) => {
    const compiler = webpack(configuration);

    let serverMfs;
    if (!isBuild) {
        serverMfs = new MFS();
        compiler.outputFileSystem = serverMfs as any;
    }

    if (isBuild)
        return compiler.run((err, stats) => {
            printStats(err, stats, 'UI');
            compiler.close(() => {
                console.log(chalk.green("build finished !!!"));
            });
        });
    return compiler.watch({}, (err, stats) => {
        if (!printStats(err, stats, 'UI')) return;

        const uiHtml = readMFSFile(serverMfs, compiler.outputPath, 'ui.html');

        hooks.callHook('update', 'ui', uiHtml);
    });
}
