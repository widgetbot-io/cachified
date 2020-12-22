import {NestFactory} from "@nestjs/core";
import {Injectable, Module} from "@nestjs/common";
import {Cachified} from "../../src/decorators";
import {CachifiedModule} from "../../src/modules";
import {CachifiedService} from "../../src/services";

@Injectable()
export class TestService {
    constructor(
       private readonly cachifiedService: CachifiedService
    ) {}
    private classProp = 'hi from class';

    @Cachified()
    async cachedMethod() {
        return this.classProp;
    }

    async onApplicationBootstrap() {
        console.log('hi from TestService');
        console.log('before invalidateAll', await this.cachedMethod());
        await this.cachifiedService.invalidateAll('TestService.cachedMethod');
        console.log('after invalidateAll', await this.cachedMethod());
    }
}

@Module({
    imports: [
      CachifiedModule.forRoot({
          client: {
              host: '127.0.0.1',
              keyPrefix: 'example:'
          }
      })
    ],
    providers: [
        TestService
    ]
})
export class ApplicationModule {}

(async () => {
   await NestFactory.createApplicationContext(ApplicationModule);
})();