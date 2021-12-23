import { camelCase, paramCase, snakeCase } from "change-case";
import Naming from "../extension/Naming";

export const convert = (source: any, targetNaming: Naming): any => {
    let result: any;
    if (Array.isArray(source)) {
        result =  source.map((item) => convert(item, targetNaming))
    } else if (typeof source == 'object' && source != null) {
        result = {};
        Object.keys(source).map((key) => result[convertKey(key, targetNaming)] = convert(source[key], targetNaming));
    } else {
        result = source;
    }

    return result;
}

const convertKey = (key: string, targetNaming: Naming): string => {
    let result;
    switch(targetNaming) {
        case Naming.CAMEL_CASE:
            result = camelCase(key);
            break;
        case Naming.SNAKE_CASE:
            result = snakeCase(key);
            break;
        case Naming.KEBAB_CASE:
            result = paramCase(key);
            break;
        default:
            result = key;
            break;
    }

    return result;
}