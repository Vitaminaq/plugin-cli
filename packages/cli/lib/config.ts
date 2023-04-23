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
}

export const localConfig: UserConfig = {
    main: "./main.ts",
    mainBuild: true,
    manifest: "./manifest.json",
    frame: 'vue'
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

export const overwriteEnv = (isBuild: boolean) => {
    process.env.NODE_ENV = isBuild ? 'production' : 'development';
}

export const isBuild = process.env.NODE_ENV === 'production';

export const defineConfig = (config: UserConfig) => config;

export type UpdateName = 'manifest' | 'main' | 'ui';

interface Hooks {
    'update': (name: UpdateName, content: string) => any;
}

export const hooks = createHooks<Hooks>();
