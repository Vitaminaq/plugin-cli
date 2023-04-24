import { cac } from "cac";
import { DevServer } from './dev-server/server';
import { compiler } from './webpack/service';
import { loadUserConfig, overwriteEnv } from './config';

const cli = cac("plugin-cli");

cli
    .command("[root]")
    .alias("dev")
    .action( async () => {
        await loadUserConfig();
        DevServer.instance;
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
