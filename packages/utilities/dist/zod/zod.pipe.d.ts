import { PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";
export declare class ZodPipe<T = unknown> implements PipeTransform {
    private readonly schema;
    constructor(schema: ZodSchema<T>);
    transform(value: unknown): T;
}
