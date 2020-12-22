# Cachified - A plug and play NestJS Redis powered cache.

[![Downloads](https://img.shields.io/npm/dt/@venix/cachified.svg)](https://www.npmjs.com/package/@venix/cachified)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@venix/cachified.svg)](https://www.npmjs.com/package/@venix/cachified)
[![Version](https://img.shields.io/npm/v/@venix/cachified.svg)](https://www.npmjs.com/package/@venix/cachified)
[![License](https://img.shields.io/npm/l/@venix/cachified.svg)](https://www.npmjs.com/package/@venix/cachified)
---
Cachified is an easy to use, redis-powered caching library that allows you to quickly cache your functions using TypeScript decorators.  
It allows you to cache functions with a one line addition to your code. 

A simple but descriptive example on how to use Cachified can be found in the [example](https://github.com/widgetbot-io/cachified/tree/master/example) folder.

---

## Initializing Cachified

### example.service.ts
```ts
import { Injectable } from '@nestjs/common';
import { Cachified } from '@venix/cachified';

@Injectable()
export class ExampleService {
    @Cachified()
    cachedMethod() {
        return "Hey from cached method"       
    }
}
```

### app.module.ts Using Redis client data
```ts
import { Module } from '@nestjs/common';
import { CachifiedModule } from '@venix/cachified';
import { ExampleService } from './example.service.ts';

const isProduction = process.env.NODE_ENV === 'production';  

@Module({
    imports: [
        CachifiedModule.forRoot({
            enabled: isProduction,
            client: {
                host: '127.0.0.1',
                port: 6379,
                db: 0,
                keyPrefix: 'project:'
            }
        })
    ],
    providers: [
        ExampleService
    ]
})
export class ApplicationModule {}
```

### app.module.ts Using pre-defiend redis client
```ts
import { Module } from '@nestjs/common';
import { CachifiedModule } from '@venix/cachified';
import * as IORedis from 'ioredis';
import { ExampleService } from './example.service.ts';

const isProduction = process.env.NODE_ENV === 'production';  

const redisClient = new IORedis({
    host: '127.0.0.1',
    port: 6379,
    db: 0,
    keyPrefix: 'project:'
});

@Module({
    imports: [
        CachifiedModule.forRoot({
            enabled: isProduction,
            client: redisClient
        })
    ],
    providers: [
        ExampleService
    ]
})
export class ApplicationModule {}
```

If you have any feature requests you would like to be implemented please [open an issue](https://github.com/widgetbot-io/cachified/issues).