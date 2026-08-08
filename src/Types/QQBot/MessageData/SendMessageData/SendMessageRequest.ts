import { Keyboard } from "./Keyboard";
import { MediaInfo } from "./MediaInfo";
import { MessageMarkdown } from "./MessageMarkDown";
import { MessageReference } from "./MessageReference";

export interface SendMessageRequest{
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
}