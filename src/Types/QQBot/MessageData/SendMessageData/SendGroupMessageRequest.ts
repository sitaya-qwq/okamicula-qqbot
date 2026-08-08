import { InputNotify } from "./InputNotify";
import { SendMessageRequest } from "./SendMessageRequest";


export interface SendGroupMessageRequest extends SendMessageRequest {
    
    input_notify?: InputNotify;
}