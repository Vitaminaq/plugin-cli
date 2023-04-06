export { buildCompiler } from './webpack/service';
import { DevServer } from './dev-server/server';
import { devCompiler } from './webpack/service';

export const devServer = () => {
    devCompiler();
    DevServer.instance;
}
