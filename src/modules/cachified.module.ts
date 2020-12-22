import {DynamicModule, Module, Provider, Type, ValueProvider} from "@nestjs/common";
import {DiscoveryModule} from "@golevelup/nestjs-discovery";

import {CachifiedConfiguration} from "../types";
import * as Services from '../services';
import {CACHIFIED_OPTIONS} from "../util";

const services = Object.values(Services);

@Module({
    imports: [
        DiscoveryModule
    ]
})
export class CachifiedModule {
    static forRoot(options: CachifiedConfiguration): DynamicModule {
        const providers: Provider[] = [
            <ValueProvider<CachifiedConfiguration>>{
                provide: CACHIFIED_OPTIONS,
                useValue: {
                    enabled: options.enabled ?? true,
                    ...options
                }
            },
            ...services
        ];

        return {
            module: CachifiedModule,
            providers,
            exports: providers
        };
    }
}