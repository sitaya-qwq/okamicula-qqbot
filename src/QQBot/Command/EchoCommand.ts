import { SendMessageData } from "../Types/QQBotTypes/MessageDataTypes/SendMessageData/SendMessageDataType";
import { BaseCommand } from "./BaseCommand";

export class EchoCommand extends BaseCommand {

    protected override _usage: string = 
    "Usage 1: \"/echo <message>\" repeat the message";

    public async Execute(reply_msg: SendMessageData, args: string[]): Promise<SendMessageData> {
        if (args.length > 0) {
            reply_msg.content = args[0];
        } else {
            reply_msg.content = this._intro;
        }

        return reply_msg;
    }
    
}