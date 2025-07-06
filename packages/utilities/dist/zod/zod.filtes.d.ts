import { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { ZodError } from "zod";
export declare class ZodFilter<T extends ZodError> implements ExceptionFilter {
    catch(exception: T, host: ArgumentsHost): void;
}
