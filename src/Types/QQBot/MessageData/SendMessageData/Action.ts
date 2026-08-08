import { Permission } from "./Permission";

export interface Action{
    type?: number;
    permission?: Permission;
    data?: string;
    click_limit?: number;
    unsupport_tips?: string;
    enter?: boolean;
    reply?: boolean;
    anchor?: number;
}