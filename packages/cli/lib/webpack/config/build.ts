import { WebpackBaseConfig } from "./base";

export class WebpackBuildConfig extends WebpackBaseConfig {
    public constructor() {
        super();
        this.config.mode("production").devtool(false);
        this.config.optimization.usedExports(false);
    }
}
