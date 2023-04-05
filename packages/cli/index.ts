import { cac } from "cac";
import { buildCompiler } from './lib/webpack/service';
import { createDevServer } from './lib/dev-server';

const cli = cac("plugin-cli");

cli
    .command("[root]")
    .alias("dev")
    .action(() => {
        createDevServer();
    });

cli
    .command("build [root]")
    .action(() => {
        buildCompiler();
    });

cli.help();

cli.version(require("./package.json").version);

cli.parse();
