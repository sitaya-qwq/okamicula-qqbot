import { ARKData, MessageAttachment, MessageScene, MsgElement, User } from "./MessageDataTypes";

export interface C2CMessageData{
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