import { buildCompiler } from './webpack/service';
import { DevServer } from './dev-server/server';
import { devCompiler } from './webpack/service';
import { loadUserConfig } from './config';

export const devServer = async () => {
    await loadUserConfig();
    devCompiler();
    DevServer.instance;
}

export const build = async () => {
    await loadUserConfig();
    buildCompiler();
}
