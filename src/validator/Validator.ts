export default abstract class Validator<T> {
    abstract isValid(arg: unknown): arg is T;

    abstract findError(arg: unknown): string | undefined;

    static isString(arg: unknown): arg is string {
        return arg !== null && typeof arg === "string";
    }

    static isNumber(arg: unknown): arg is number {
        return arg !== null && typeof arg === "number" && !isNaN(arg);
    }

    static isObject(arg: unknown): arg is object {
        return arg !== null && typeof arg === 'object' && !Array.isArray(arg);
    }
}