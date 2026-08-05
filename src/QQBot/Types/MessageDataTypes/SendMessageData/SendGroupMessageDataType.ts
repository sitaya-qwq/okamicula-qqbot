import { SendMessageData, InputNotify, Keyboard, MediaInfo, MessageMarkdown, MessageReference } from "./SendMessageDataType";


export interface SendGroupAtMessageData extends SendMessageData {
    
    input_notify?: InputNotify;
}