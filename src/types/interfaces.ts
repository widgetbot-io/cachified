import * as IORedis from 'ioredis';

export interface CachifiedConfiguration {
    client: IORedis.Redis | IORedis.RedisOptions
    enabled?: boolean
}

export interface CachifiedDecoratorOptions {
    transform?: (...args: any[]) => any[];
}

export interface CachifiedDecoratorMetadata extends CachifiedDecoratorOptions {
    expirySeconds: number;
}