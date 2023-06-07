import { loadConfig } from 'c12'
import { createHooks } from 'hookable';

export const root = process.cwd();

export interface UserConfig {
    ui?: string;
    main?: string;
    mainBuild?: boolean;
    manifest?: string;
    chainWebpack?: Function;
    configureWebpack?: Object | Function;
    frame?: 'vue' | 'react' | 'none';
    template?: string;
}

export const localConfig: UserConfig = {
    main: "./main.ts",
    mainBuild: true,
    manifest: "./manifest.json",
    frame: 'vue',
    template: 'ui.html',
};

export const loadUserConfig = async () => {
    const { config } = await loadConfig<UserConfig>({
        name: 'plugin',
        configFile: 'plugin.config',
        rcFile: '.pluginrc',
        dotenv: true,
        globalRc: true,
    });

    if (!config) return;

    Object.assign(localConfig, config);
}

export let isBuild = false;

export const overwriteEnv = (build: boolean) => {
    process.env.NODE_ENV = build ? 'production' : 'development';
    isBuild = build;
}

export const defineConfig = (config: UserConfig) => config;

export type UpdateName = 'manifest' | 'main' | 'ui';

interface Hooks {
    'update': (name: UpdateName, content: string) => any;
}

export const hooks = createHooks<Hooks>();

export const servicePort = 5201;
