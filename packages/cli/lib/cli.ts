import { cac } from "cac";
import { compiler } from './webpack';
import { loadUserConfig, overwriteEnv } from './config';

const cli = cac("plugin-cli");

cli
    .command("[root]")
    .alias("dev")
    .action( async () => {
        await loadUserConfig();
        compiler();
    });

cli
    .command("build [root]")
    .action(async () => {
        overwriteEnv(true);
        await loadUserConfig();
        compiler();
    });

cli.help();

cli.version(require("../package.json").version);

cli.parse();
