import { SendMessageData } from "../Types/QQBotTypes/MessageDataTypes/SendMessageData/SendMessageDataType";

export abstract class BaseCommand {
    protected readonly _label: string;
    protected readonly _intro: string;
    protected _usage: string = "Not implemented";
    
    public constructor(label: string, intro: string) {
        this._label = label;
        this._intro = intro
    }
    
    public GetIntro(): string {return this._intro;}
    public GetLabel(): string {return this._label;}
    public GetUsage(): string {
        return this._usage;
    }
    
    
    
    public abstract Execute(reply_msg: SendMessageData, args: string[]): Promise<SendMessageData>
}