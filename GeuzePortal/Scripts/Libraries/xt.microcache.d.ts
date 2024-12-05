// Type definitions for MicroCache
// Project: https://github.com/jeromeetienne/microcache.js
// Definitions by: André Geuze
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare class MicroCache {
    get(key: string): any;
    contains(key: string): boolean;
    remove(key: string): void;
    set(key: string, value: any): void;
    values(): any;
    getSet(key: string, value: any): any;
}