import { DevServer } from './dev-server/server';
import { compiler } from './webpack/service';
import { loadUserConfig } from './config';

export const devServer = async () => {
    await loadUserConfig();
    compiler();
    DevServer.instance;
}

export const build = async () => {
    await loadUserConfig();
    compiler();
}
