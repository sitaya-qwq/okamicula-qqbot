import { cp } from "fs";
import { commandMap } from "../../Command/CommandMap";
import { ReceiveMessageData } from "../../Types/QQBotTypes/MessageDataTypes/ReceiveMessageData/ReceiveMessageDataType";
import { SendMessageData } from "../../Types/QQBotTypes/MessageDataTypes/SendMessageData/SendMessageDataType";
import { UploadMediaRequest, UploadMediaResponse } from "../../Types/QQBotTypes/MessageDataTypes/UploadMediaTypes";
import { BaseEvent } from "../BaseEvent";

export abstract class MessageCreateEvent extends BaseEvent<ReceiveMessageData> {
    protected abstract PostMessage(openid: string, reply_msg: SendMessageData): Promise<void>;
    protected abstract UploadMedia(body: UploadMediaRequest): Promise<UploadMediaResponse>;

    protected async GetSendMessageData(replyMsg: SendMessageData): Promise<SendMessageData> {
        try {
            const recvMsg: ReceiveMessageData = this._data as ReceiveMessageData;
            replyMsg.content = recvMsg.content;
            
            const cmdline = recvMsg.content.trim();
            if (cmdline.length <= 1 || !cmdline.startsWith('/')) {
                return replyMsg;
            }
            const [cmdLabel, ...args] = cmdline.slice(1).split(' ');
            commandMap.get(cmdLabel)?.Execute(replyMsg,args);

            return replyMsg;
        } catch (error) {
            console.error('命令处理错误:', error);
            replyMsg.content = '处理命令时出错，请重试。';
            return replyMsg;
        }
    }


}