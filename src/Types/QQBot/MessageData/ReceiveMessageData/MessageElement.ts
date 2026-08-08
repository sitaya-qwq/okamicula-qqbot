import { ARKData } from "./ARKData";
import { MessageAttachment } from "./MessageAttachment";
import { User } from "./User";

export interface MsgElement{
    msg_idx: string;
    author: User;
    message_type: number;
    content: string;
    attachments: MessageAttachment[];
    ark_data: ARKData;
    msg_elements: MsgElement[]
}