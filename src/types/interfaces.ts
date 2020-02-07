import * as IORedis from "ioredis";

export interface CachifiedInstance {
    client?: IORedis.Redis,
    enabled?: boolean
}

export interface CachifiedConfiguration {
    redisConfig?: IORedis.RedisOptions
    client?: IORedis.Redis
    enabled?: boolean
}