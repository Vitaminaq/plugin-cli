import { WebpackBaseConfig } from "./base";

export class WebpackDevConfig extends WebpackBaseConfig {
    public constructor() {
        super();
        this.config.mode("production");
        this.config.devtool(false);
    }
}
