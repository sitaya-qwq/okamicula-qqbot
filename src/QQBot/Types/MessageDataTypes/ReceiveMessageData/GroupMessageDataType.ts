import { ARKData, ReceiveMessageData, MessageAttachment, MessageScene, MsgElement, User } from "./ReceiveMessageDataType";

export interface GroupMessageData extends ReceiveMessageData{
    mentions: User[];
    group_openid: string;
}