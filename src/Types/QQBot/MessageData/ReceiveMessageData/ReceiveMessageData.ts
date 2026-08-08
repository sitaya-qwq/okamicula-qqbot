import { ARKData } from "./ARKData";
import { MessageAttachment } from "./MessageAttachment";
import { MsgElement } from "./MessageElement";
import { MessageScene } from "./MessageScene";
import { User } from "./User";

export interface ReceiveMessageData{
    id: string;
    author: User;
    content: string;
    timestamp: string;
    message_type: number;
    message_scene: MessageScene;
    attachments: MessageAttachment[];
    ark_data: ARKData;
    msg_elements: MsgElement[];
}