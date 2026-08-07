import { SendMessageData } from "../Types/QQBotTypes/MessageDataTypes/SendMessageData/SendMessageDataType";
import { BaseCommand } from "./BaseCommand";
import { commandMap } from "./CommandMap";

export class HelpCommand extends BaseCommand {

    protected override _usage: string = 
    "Usage 1: \"/help\" Display all of the commands\n" +
    "Usage 2: \"/help <command label>\" get the usage for a specific command"

    public async Execute(reply_msg: SendMessageData, args: string[]): Promise<SendMessageData> {
        if (args.length > 0) {
            const cmd: BaseCommand | undefined = commandMap.get(args[0]);
            if (cmd === undefined) {
                reply_msg.content = `Command: ${args[0]} Not found`;
            }
            else{
                reply_msg.content = cmd.GetUsage()
            }
        }
        else {
            let msg: string = "List of all commands:\n"
            for (const [label,cmd] of commandMap) {
                msg += `\t/${label} - ${cmd.GetIntro()} \n`;
            }
            msg += "Here are all of the commands...";

            reply_msg.content = msg;
        }

        return reply_msg;
    }
    

}