import { Action } from "./Action";
import { RenderData } from "./RenderData";

export interface Button{
    id?: string;
    render_data?: RenderData;
    action?: Action;
}