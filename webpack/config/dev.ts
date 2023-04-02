import { WebpackBaseConfig } from "./base";

export class WebpackDevConfig extends WebpackBaseConfig {
    public constructor(userConfig: any) {
        super();
        this.config.mode("production").entry('index').add("./src/index.ts").end();
        this.config.devtool(false);

        this.mergeUserConfig(userConfig);
    }

    public mergeUserConfig(userConfig: any) {
        // userConfig.chainWebpack(this.config);
    }
}
