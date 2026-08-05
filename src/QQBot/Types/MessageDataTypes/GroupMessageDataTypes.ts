import { ARKData, MessageAttachment, MessageScene, MsgElement, User } from "./MessageDataTypes";

export interface GroupMessageData{
    id: string;
    author: User;
    content: string;
    group_openid: string
    timestamp: string;
    message_type: number;
    message_scene: MessageScene;
    attachments: MessageAttachment[];
    mentions: User[]
    ark_data: ARKData;
    msg_elements: MsgElement[];
}