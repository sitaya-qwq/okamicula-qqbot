import { MessageExtInfo } from "./MessageExtInfo";

export interface SendMessageResponse{
    id: string;
    timestrap: string;
    ext_info: MessageExtInfo;
}