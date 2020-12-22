import {Inject, Injectable} from "@nestjs/common";
import {DiscoveryService} from "@golevelup/nestjs-discovery";
import * as IORedis from "ioredis";
import {CachifiedConfiguration, CachifiedDecoratorMetadata} from "../types";
import {CACHIFIED_DECORATOR, CACHIFIED_OPTIONS} from "../util";

@Injectable()
export class CachifiedService {
    private redisClient!: IORedis.Redis;

    constructor(
       @Inject(CACHIFIED_OPTIONS) private readonly options: CachifiedConfiguration,
       private readonly discoveryService: DiscoveryService
    ) {}

    private async onModuleInit() {
        this.redisClient = this.options.client instanceof IORedis ? this.options.client : new IORedis(this.options.client);

        const cachedMethods = await this.discoveryService.providerMethodsWithMetaAtKey<CachifiedDecoratorMetadata>(CACHIFIED_DECORATOR);

        for (const cachedMethod of cachedMethods) {
            const { parentClass, methodName, handler } = cachedMethod.discoveredMethod;
            const { meta: options } = cachedMethod;

            if (!this.options.enabled) return;

            const cachedFunction = async (...args: any[]) => {
                args = options.transform ? options.transform(...args) : args;

                const invalidArgs = args.filter(arg => typeof arg === 'object');
                if (invalidArgs.length) throw new Error(`Invalid arguments (typeof object) specified to Cachified function: ${args}`);

                const redisKey = `cachified:${parentClass.name}.${methodName}(${args.join(',')})`;

                const val = await this.getRawVal(redisKey);
                if (val !== null) {
                    try {
                        return JSON.parse(val);
                    } catch {
                        return val;
                    }
                }

                const returnedData = await handler.apply(parentClass.instance, args);

                try {
                    await this.setRawValWithExpiry(redisKey, JSON.stringify(returnedData), options.expirySeconds);
                } catch {
                    await this.setRawValWithExpiry(redisKey, returnedData, options.expirySeconds);
                }

                return returnedData;
            }

            (cachedMethod.discoveredMethod.parentClass.instance as any)[cachedMethod.discoveredMethod.methodName] = cachedFunction.bind(this);
        }
    }

    private async getRawVal(key: string) {
        if (!this.redisClient) throw new Error('Attempted Cachified usage without initialization');

        return await this.redisClient.get(key);
    }

    private async setRawValWithExpiry(key: string, value: any, expiry: number) {
        if (!this.redisClient) throw new Error('Attempted Cachified usage without initialization');

        return await this.redisClient.set(key, value, 'EX', expiry);
    }

    async invalidate(name: string, ...args: any[]) {
        const invalidArgs = args.filter(arg => typeof arg === 'object');
        if (invalidArgs.length) throw new Error(`Invalid arguments (typeof object) specified to Cachified function: ${args}`);

        const redisKey = `cachified:${name}(${args.join(',')})`;

        return await this.redisClient.del(redisKey);
    }

    async invalidateAll(name: string) {
        const keys = await this.redisClient.keys(`${this.redisClient.options.keyPrefix || ''}cachified:${name}(*)`)

        return await this.redisClient.del(...keys.map(key => key.slice((this.redisClient.options.keyPrefix || '').length)));
    }
}