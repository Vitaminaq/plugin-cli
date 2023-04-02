import { WebpackBaseConfig } from "./base";

export class WebpackBuildConfig extends WebpackBaseConfig {
    public constructor(userConfig: any) {
        super();
        this.mergeUserConfig(userConfig);
    }

    public mergeUserConfig(userConfig: any) {
        userConfig.chainWebpack(this.config);
    }
}
