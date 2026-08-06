import { ReceiveMessageData } from "../../Types/MessageDataTypes/ReceiveMessageData/ReceiveMessageDataType";
import { SendMessageData } from "../../Types/MessageDataTypes/SendMessageData/SendMessageDataType";
import { UploadMediaRequest, UploadMediaResponse } from "../../Types/MessageDataTypes/UploadMediaTypes";
import { BaseEvent } from "../Event";

interface ImgResponse{
    code: number;
    imgurl: string; 
    source: string;
    id: string;
}

async function GetImgResponse(): Promise<ImgResponse> {
    const url = "https://www.dmoe.cc/random.php?return=json";
    const res = await fetch(url,{method: "GET"});
    if (res.status != 200) {
        throw new Error(`Failed to fetch images`);
    }
    return (res.json() as Promise<ImgResponse>);
}

export abstract class MessageCreateEvent extends BaseEvent<ReceiveMessageData> {
    protected abstract PostMessage(openid: string, reply_msg: SendMessageData): Promise<void>;
    protected abstract UploadMedia(body: UploadMediaRequest): Promise<UploadMediaResponse>;

    protected async GetSendMessageData(replyMsg: SendMessageData): Promise<SendMessageData> {
        try {
            const cmdline = this._data?.content?.trim();
            if (cmdline.length <= 1 || !cmdline.startsWith('/')) {
                return replyMsg;
            }

            const [command, ...args] = cmdline.slice(1).split(' ');
            
            switch (command) {
                case "rr":{
                    replyMsg.msg_type = 7;
                    const imgRes: ImgResponse = await GetImgResponse();
                    const uploadRes: UploadMediaResponse = await this.UploadMedia({
                        file_type: 1,
                        url: imgRes.source,
                        srv_send_msg:false
                    });
                    if (!replyMsg.media) {
                        replyMsg.media = {};
                    }
                    replyMsg.media.file_info = uploadRes.file_info;
                    replyMsg.content = `图片接口地址: ${imgRes.imgurl}\n源图片地址: ${imgRes.source}\n图片ID: ${imgRes.id}`;
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


}