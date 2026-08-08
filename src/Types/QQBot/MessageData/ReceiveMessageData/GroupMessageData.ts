import { ReceiveMessageData } from "./ReceiveMessageData";
import { User } from "./User";

export interface GroupMessageData extends ReceiveMessageData{
    mentions: User[];
    group_openid: string;
}