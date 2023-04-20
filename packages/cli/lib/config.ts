import { loadConfig } from 'c12'

export const root = process.cwd();

interface UserConfig {
    ui?: string;
    main: string;
    mainBuild?: boolean;
    manifest: string;
    chainWebpack?: Function;
    configureWebpack?: Object | Function;
}

export const localConfig: UserConfig = {
    main: "./main.ts",
    manifest: "./manifest.json"
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

export const defineConfig = (config: UserConfig) => {};
