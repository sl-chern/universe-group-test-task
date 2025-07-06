import { PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";
export declare class ZodPipe implements PipeTransform {
    private readonly schema;
    constructor(schema: ZodSchema);
    transform(value: unknown): unknown;
}
