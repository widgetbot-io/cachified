import {Cachified} from "../src";
import {ConfigureCachified} from "../src/configure";

ConfigureCachified({
    redisConfig: {
        host: '127.0.0.1',
        keyPrefix: 'development:'
    }
});

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

const viction = new Person('viction');

(async function() {
    console.log(await viction.timed());
    console.log(await viction.timedObject());
})();