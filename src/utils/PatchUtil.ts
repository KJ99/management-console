import { ClassConstructor, classToPlain, instanceToInstance, instanceToPlain, plainToInstance } from "class-transformer";
import Naming from "../extension/Naming";
import * as CaseConverter from './CaseConverter';
import * as Formatter from './ObjectFormatter';
import { createPatch } from 'rfc6902';
import { mapper } from "./Mapper";

export const prepare = (original: any, updated: any) => {
    const originalAsUpdateModel = mapper.map(original, updated.constructor, original.constructor);
    let source = instanceToPlain(originalAsUpdateModel);
    source = CaseConverter.convert(source, Naming.SNAKE_CASE);
    Formatter.format(source);

    let modified = instanceToPlain(updated);
    modified = CaseConverter.convert(modified, Naming.SNAKE_CASE);
    Formatter.format(modified);

    return createPatch(source, modified);
}