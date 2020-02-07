import {DynamicModule, Module} from "@nestjs/common";
import {CachifiedConfiguration} from "../types";
import {ConfigureCachified} from "../configure";


@Module({})
export class CachifiedModule {
    static register(options: CachifiedConfiguration): DynamicModule {
        ConfigureCachified(options);

        return {
            module: CachifiedModule
        };
    }
}