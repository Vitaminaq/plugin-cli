import { WebpackBaseConfig } from "./base";

export class WebpackDevConfig extends WebpackBaseConfig {
    public constructor() {
        super();
        this.config.mode("production").devtool(false);
        this.config.optimization.sideEffects(false).usedExports(false);
    }
}
