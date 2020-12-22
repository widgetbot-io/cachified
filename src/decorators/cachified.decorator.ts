import {CustomDecorator, SetMetadata} from "@nestjs/common";
import {CachifiedDecoratorOptions, CachifiedDecoratorMetadata} from "../types";
import { CACHIFIED_DECORATOR } from "../util";

export function Cachified(): CustomDecorator
export function Cachified(expirySeconds: number): CustomDecorator
export function Cachified(options: CachifiedDecoratorOptions): CustomDecorator
export function Cachified(expirySeconds: number, options: CachifiedDecoratorOptions): CustomDecorator
export function Cachified(expirySecondsOrOptions?: number | CachifiedDecoratorOptions, options?: CachifiedDecoratorOptions): CustomDecorator {
    if (!options) options = typeof expirySecondsOrOptions === 'number' ? {} : (expirySecondsOrOptions || {});

    const expirySeconds = typeof expirySecondsOrOptions === 'number' ? expirySecondsOrOptions : 24 * 60 * 60;

    return SetMetadata<string, CachifiedDecoratorMetadata>(CACHIFIED_DECORATOR, {
        expirySeconds,
        ...options
    });
}