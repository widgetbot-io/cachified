import {CachifiedConfiguration, CachifiedInstance} from "../types";
import * as IORedis from "ioredis";

const config: CachifiedInstance = {};

export function ConfigureCachified(opts: CachifiedConfiguration) {
    config.enabled = opts.enabled === undefined ? true : opts.enabled;

    if (opts.client) return config.client = opts.client;
    if (opts.redisConfig) return config.client = new IORedis(opts.redisConfig);

    throw new Error('No valid instance of redis was passed to Cachified config');
}

export function GetConfig() {
    return config;
}