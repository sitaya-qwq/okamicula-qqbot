import { OperateCode } from "./OperateCode";

export interface Payload<T = unknown>
{
    id: string;
    op: OperateCode;
    d: T,
    s?: number;
    t?: string;
}