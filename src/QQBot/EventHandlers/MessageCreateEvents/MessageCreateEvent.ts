import { ReceiveMessageData } from "../../Types/MessageDataTypes/ReceiveMessageData/ReceiveMessageDataType";
import { SendMessageData } from "../../Types/MessageDataTypes/SendMessageData/SendMessageDataType";
import { BaseEvent } from "../Event";

export abstract class MessageCreateEvent extends BaseEvent<ReceiveMessageData> {
    protected async GetSendMessageData(replyMsg: SendMessageData): Promise<SendMessageData> {
        try {
            const cmdline = this._data?.content?.trim();
            if (cmdline.length <= 1 || !cmdline.startsWith('/')) {
                return replyMsg;
            }

            const [command, ...args] = cmdline.slice(1).split(' ');
            
            switch (command) {
                case "rr":{
                    replyMsg.msg_type = 0;
                    replyMsg.content = "qwq";
                    break;
                }
                default:{
                    replyMsg.msg_type = 0;
                    replyMsg.content = `未知命令: /${command}`;
                    break;
                }
            }
            
            return replyMsg;
        } catch (error) {
            console.error('命令处理错误:', error);
            replyMsg.content = '处理命令时出错，请重试。';
            return replyMsg;
        }
    }

    protected abstract PostMessage(openid: string, reply_msg: SendMessageData): Promise<void>;

}