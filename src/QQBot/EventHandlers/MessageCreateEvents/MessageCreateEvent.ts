import { ReceiveMessageData } from "../../Types/MessageDataTypes/ReceiveMessageData/ReceiveMessageDataType";
import { SendMessageData } from "../../Types/MessageDataTypes/SendMessageData/SendMessageDataType";
import { BaseEvent } from "../Event";

interface ResponseData {
	id: string
	request_id: string
	created: number
	model: string
	choices: Choice[]
	usage: Usage
	video_result?: VideoResult[]
	web_search?: WebSearchResult[]
	content_filter?: ContentFilter[]
}
interface Choice {
	index: number
	message: Message
	finish_reason: string
}
interface Message {
	role: string
	content: string
	//reasoning_content?: string
	//audio?: Audio
	//tool_calls?: ToolCall[]
}
interface Audio {
	id: string
	data: string
	expires_at: string
}
interface ToolCall {
	function?: FunctionCall
	mcp?: MCPCall
	id: string
	type: string
}
interface FunctionCall {
	name: string
	arguments: string
}
interface MCPCall {
	id: string
	server_label: string
	error?: string
	tools?: MCPTool[]
	arguments: string
	name: string
	output?: any
}
interface MCPTool {
	name: string
	description: string
	annotations: Record<string, any>
	input_schema: InputSchema
}
interface InputSchema {
	type: "object"
	properties: Record<string, any>
	required: string[]
	additionalProperties: boolean
}
interface Usage {
	prompt_tokens: number
	completion_tokens: number
	prompt_tokens_details: PromptTokensDetails
	total_tokens: number
}
interface PromptTokensDetails {
    cached_tokens: number
}
interface VideoResult {
	url: string
	cover_image_url: string
}
interface WebSearchResult {
	icon: string
	title: string
	link: string
	media: string
	publish_date: string
	content: string
	refer: string
}
interface ContentFilter {
	role: string
	level: number
}

interface Error{
    code: number;
    message: string;
}

interface ErrorResponse{
    error: Error;
}

// ============ 读取函数 ============
async function ReadMessageHistory(key: string, env: Env): Promise<Message[]> {
    try {
        const data = await env.QQBOT_CHAT_HISTORY.get(key, 'json');
        
        if (!data) {
            return [{role:"system",content:`${env.AI_SystemPrompt}`}];
        }
        
        // 确保返回的是数组（类型安全）
        if (Array.isArray(data)) {
            return data as Message[];
        }
        
        // 如果数据格式不对，返回空数组
        return [];
        
    } catch (error) {
        console.error(`Failed to read messages for key "${key}":`, error);
        return [];
    }
}

// ============ 更新函数 ============
async function UpdateMessageHistory(key: string, messages: Message[], env: Env): Promise<void> {
    try {
        // 直接存储整个 Message 数组
        await env.QQBOT_CHAT_HISTORY.put(key, JSON.stringify(messages));
        
    } catch (error) {
        console.error(`Failed to update messages for key "${key}":`, error);
        throw error;
    }
}



export abstract class MessageCreateEvent extends BaseEvent<ReceiveMessageData> {
    protected async GetSendMessageData(replyMsg: SendMessageData): Promise<SendMessageData> {
        try {
            const cmdline = this._data?.content?.trim() || '';
            if (!cmdline.startsWith('/') || cmdline.length <= 1) {
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