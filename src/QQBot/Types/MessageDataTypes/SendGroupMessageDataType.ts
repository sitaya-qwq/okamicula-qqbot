import { InputNotify, Keyboard, MediaInfo, MessageMarkdown, MessageReference } from "./SendMessageDataType";


export interface SendGroupAtMessageData {
    msg_type?: number;
    content?: string;
    markdown?: MessageMarkdown;
    keyboard?: Keyboard;
    msg_id?: string;
    event_id?: string;
    msg_seq?: number;
    media?: MediaInfo;
    message_reference?: MessageReference;
    is_wakeup?: boolean;
    input_notify?: InputNotify;
}