import {GetConfig} from './configure';
import {CachifiedInstance} from './types';

interface CachifiedOptions {
    transform?: (...any: any[]) => any[],
    customJoinStr?: string // - is default
}

export function Cachified(expirySeconds: number = 24 * 60 * 60, options?: CachifiedOptions): MethodDecorator { // One day expiry default
    return function(target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
        const oldFunc = descriptor.value;

        descriptor.value = async function(...args: any[]) {
            args = !!options?.transform ? options.transform(...args) : args;

            const config = GetConfig();

            if (!config.enabled) return oldFunc.apply(this, args);

            const redisKey = `cachified:${oldFunc.name}_${args.join(options?.customJoinStr || '-')}`;

            const val = await getRawVal(config, redisKey);
            if (val) {
                try {
                    return JSON.parse(val);
                } catch {
                    return val;
                }
            }

            const returnedData = await oldFunc.apply(this, args);

            try {
                await setRawValWithExpiry(config, redisKey, JSON.stringify(returnedData), expirySeconds);
            } catch {
                await setRawValWithExpiry(config, redisKey, returnedData, expirySeconds);
            }

            return returnedData;
        }
    }
}

function getRawVal(config: CachifiedInstance, key: string) {
    if (!config.client) throw new Error('Attempted Cachified usage without initialization');

    return config.client.get(key);
}

function setRawValWithExpiry(config: CachifiedInstance, key: string, value: any, expiry: number) {
    if (!config.client) throw new Error('Attempted Cachified usage without initialization');

    return config.client.set(key, value, 'EX', expiry);
}
