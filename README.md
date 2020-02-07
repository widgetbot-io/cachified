# Cachified - A simple redis powered cache.

[![Downloads](https://img.shields.io/npm/dt/@venix/cachified.svg)](https://www.npmjs.com/package/@venix/cachified)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@venix/cachified.svg)](https://www.npmjs.com/package/@venix/cachified)
[![Version](https://img.shields.io/npm/v/@venix/cachified.svg)](https://www.npmjs.com/package/@venix/cachified)
[![License](https://img.shields.io/npm/l/@venix/cachified.svg)](https://www.npmjs.com/package/@venix/cachified)
---
Cachified is an easy to use, redis-powered caching library that allows you to quickly cache your functions using TypeScript decorators.  
It allows you to cache functions with a one line addition to your code. 

A simple but descriptive example on how to use Cachified can be found in the [example](https://github.com/widgetbot-io/cachified/tree/master/example) folder.

---

## Configuring Cachified via connnection config

### index.ts
```ts
import { ConfigureCachified } from '@venix/cachified';

const isProduction = process.env.NODE_ENV === 'production';

ConfigureCachified({
    enabled: isProduction,
    redisOptions: {
        host: '127.0.0.1',
        port: 6379,
        db: 0,
        keyPrefix: 'project:'
    }
});
```

## Configuring Cachified via redis connection

### index.ts
```ts
import * as Redis from 'ioredis';
import { ConfigureCachified } from '@venix/cachified';

const isProduction = process.env.NODE_ENV === 'production';

const redisClient = new Redis({
    host: '127.0.0.1',
    port: 6379,
    db: 0,
    keyPrefix: 'project:'
});

ConfigureCachified({
    enabled: isProduction,
    client: redisClient
});
```

## Using cachified after  configuration

### index.ts
```ts
import { Cachified } from '@venix/cachified';

class Person {
    constructor(private readonly name: string) {}

    @Cachified()
    greet() {
        return `Hello ${this.name}!`
    }

    @Cachified(7 * 24 * 60 * 60)
    timed() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('HELLO');
            }, 1000);
        });
    }

    @Cachified()
    timedObject() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ cache: 'not hit' });
            }, 1000);
        });
    }
}

async function test() {
    const viction = new Person('viction');

    console.log(await viction.timed());
    console.log(await viction.timedObject());
};

test();
```

## Initializing Cachified in a NestJS environment

### app.module.ts
```ts
import { Module } from '@nestjs/common';
import { CachifiedModule } from '@venix/cachified';

const isProduction = process.env.NODE_ENV === 'production';  

@Module({
    imports: [
        CachifiedModule.register({
            enabled: isProduction,
            redisOptions: {
                host: '127.0.0.1',
                port: 6379,
                db: 0,
                keyPrefix: 'project:'
            }
        })
    ]
})
export class ApplicationModule {}
```

If you have any feature requests you would like to be implemented please [open an issue](https://github.com/widgetbot-io/cachified/issues).