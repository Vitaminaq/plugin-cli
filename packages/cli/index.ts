import { cac } from "cac";
import { build, devServer } from './lib';

const cli = cac("plugin-cli");

cli
    .command("[root]")
    .alias("dev")
    .action(() => {
        devServer();
    });

cli
    .command("build [root]")
    .action(() => {
        build();
    });

cli.help();

cli.version(require("./package.json").version);

cli.parse();
