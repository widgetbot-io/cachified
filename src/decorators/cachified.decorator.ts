import {SetMetadata} from "@nestjs/common";
import {CachifiedDecoratorOptions, CachifiedDecoratorMetadata} from "../types";
import { CACHIFIED_DECORATOR } from "../util";

export function Cachified(expirySeconds: number = 24 * 60 * 60, options: CachifiedDecoratorOptions = {}) {
    return SetMetadata<string, CachifiedDecoratorMetadata>(CACHIFIED_DECORATOR, {
        expirySeconds,
        ...options
    });
}