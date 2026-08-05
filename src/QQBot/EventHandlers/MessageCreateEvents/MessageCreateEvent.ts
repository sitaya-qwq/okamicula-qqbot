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

interface Message {
    role: string;
    content: string;
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
            return replyMsg;
        }catch(error){
            console.error(error);
            throw error;
        } 
    }

    protected abstract PostMessage(openid: string): Promise<void>;
    
    protected async FetchReply(msg: string, key: string): Promise<string> {
        try {
            const AI_BASE_URL: string = this._env.AI_APIURL;
            const AI_API_KEY: string = this._env.AI_APIKEY;
            const MODEL: string = "GLM-4.7-FLASH";
            const chatHistory: Message[] = await ReadMessageHistory(key,this._env);
            chatHistory.push({role: "user", content: msg});
            const res: Response = await fetch(AI_BASE_URL,{
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${AI_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    model: MODEL,
                    temperature: 1.0,
                    stream: false,
                    messages: chatHistory
                })
            });
    
            if (res.status !== 200){
                throw new Error(`Failed to fetch reply message from AI with status code: ${(await res.json())}`);
            }
            
            const data: ResponseData = await res.json();
            console.log("[FetchReply] A reply request sent",data.choices[0].message.content);
            chatHistory.push({role: "assistant", content: data.choices[0].message.content});
            await UpdateMessageHistory(key,chatHistory,this._env);
            return data.choices[0].message.content;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}