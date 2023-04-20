import { WebpackBaseConfig } from './base';
import { localConfig } from "../../config";

export class WebpackMainConfig extends WebpackBaseConfig {
    public constructor() {
        super();
        const { config } = this;
        config
            .entry("main")
            .add(localConfig.main)
            .end();
    }
}
