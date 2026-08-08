import { env } from "cloudflare:workers";
import { BaseAPIClient } from "../BaseAPIClient/BaseAPIClient";
import { QQBotAPIError } from "./Error/QQBotAPIError";
import { AccessTokenResponse } from "../../Types/QQBot/AccessToken/AccessTokenResponse";
import { AccessTokenRequest } from "../../Types/QQBot/AccessToken/AccessTokenRequest";
import { logger } from "../..";
import { SendMessageResponse } from "../../Types/QQBot/MessageData/SendMessageData/SendMessageResponse";
import { SendC2CMessageRequest } from "../../Types/QQBot/MessageData/SendMessageData/SendC2CMessageRequest";
import { SendGroupMessageRequest } from "../../Types/QQBot/MessageData/SendMessageData/SendGroupMessageRequest";
import { HTTPError } from "../BaseAPIClient/Error/HTTPError";
import { QQBotOpenAPIError } from "./Error/QQBotOpenAPIError";
import { OpenAPIErrorCode } from "../../Types/QQBot/OpenAPIErrorCode";
import { SendMessageRequest } from "../../Types/QQBot/MessageData/SendMessageData/SendMessageRequest";
import { UploadMediaRequest } from "../../Types/QQBot/UploadMedia/UploadMediaRequest";
import { UploadMediaResponse } from "../../Types/QQBot/UploadMedia/UploadMediaResponse";

let tokenCache: { token: string; expiresAt: number } | null = null;
export function ClearTokenCache(): void {
    tokenCache = null;
    console.log('[ClearTokenCache] Token 缓存已清除');
}

export class QQBotAPIClient extends BaseAPIClient {
    protected async GetAccessToken(): Promise<string>{
        try {
            if (tokenCache && tokenCache.expiresAt > Date.now()) {
                console.log(`[${this.name_}] 使用缓存的 Token`);
                return tokenCache.token;
            }          
            
            const appId = env.BOT_APPID;
            const appSecret = env.BOT_SECRET;
            const path = "/app/getAppAccessToken";

            if (!appId || !appSecret) {
                throw new QQBotAPIError("BOT_APPID and BOT_SECRET are both required!")
            }
            const requestBody: AccessTokenRequest = {
                appId: env.BOT_APPID,
                clientSecret: env.BOT_SECRET
            }
            const accessTokenResponse: AccessTokenResponse = await this.PostJson<AccessTokenResponse,AccessTokenRequest>(path,requestBody);
            const bufferMs = 5 *60 *1000;
            tokenCache = {
                token: accessTokenResponse.access_token,
                expiresAt: Date.now() + (accessTokenResponse.expires_in * 1000) - bufferMs
            };

            logger.log(`[${this.name_}] Successfully acquired access token which expires in ${accessTokenResponse.expires_in} seconds`);
            
            return accessTokenResponse.access_token;
        } catch (error) {
            const err = error as Error;
            logger.error(`[${this.name_}]` + err.message, {
                stack: err.stack
            });
            throw err;
        }   
    }

    private async SendQQRequest_<ResponseType = any, RequestType = any>(path: string, body: RequestType): Promise<ResponseType> {
        try {
            const accessToken = await this.GetAccessToken();
            if (!accessToken) {
                throw new QQBotAPIError("Invalid AccessToken!");
            }
            const headers: Record<string,string> = {
                "Authorization" : `QQBot ${accessToken}`
            }

            const response: ResponseType = await this.PostJson<ResponseType,RequestType>(path,body,headers);
            
            return response;
        } catch (error) {
            if (error instanceof HTTPError) {
                const response: Response | undefined = error.GetResponse()
                if (!response) {throw error}
                const openAPIErrorCode: OpenAPIErrorCode = await response.json() as OpenAPIErrorCode;
                throw new QQBotOpenAPIError(openAPIErrorCode.err_code,openAPIErrorCode.message,openAPIErrorCode.trace_id);
            }
            throw error;
        }        
    }

    public async SendC2CMessage(user_openid: string, reply_msg: SendC2CMessageRequest): Promise<SendMessageResponse> {
        try {
            const path: string = `/v2/users/${user_openid}/messages`;
            const response: SendMessageResponse = await this.SendQQRequest_<SendMessageResponse,SendC2CMessageRequest>(path,reply_msg);
            
            logger.log(`[${this.name_}] Successfully sent a message to user ${user_openid} | Message ID: (${response.id}).`,response);           
            return response;
        } catch (error) {
            logger.error(`[${this.name_}]` + (error as Error).message)
            throw error;
        }
    }

    public async SendGroupMessage(group_openid: string, reply_msg: SendGroupMessageRequest): Promise<SendMessageResponse> {
        try {
            const path: string = `/v2/groups/${group_openid}/messages`;
            const response: SendMessageResponse = await this.SendQQRequest_<SendMessageResponse,SendGroupMessageRequest>(path,reply_msg);
            
            logger.log(`[${this.name_}] Successfully sent a message in group ${group_openid} | Message ID: (${response.id}).`,response);           
            return response;
        } catch (error) {
            logger.error(`[${this.name_}]` + (error as Error).message)
            throw error;
        }
    }

    public async UploadC2CMedia(user_openid: string, file_info: UploadMediaRequest): Promise<UploadMediaResponse>{
        try {
            const path: string = `/v2/users/${user_openid}/files`
            const response: UploadMediaResponse = await this.SendQQRequest_<UploadMediaResponse,UploadMediaRequest>(path,file_info);
            
            logger.log(`Successfully uploaded a file for the user(${user_openid}) (File UUID: ${response.file_uuid})`);
            return response;
        } catch (error) {
            logger.error(`[${this.name_}]` + (error as Error).message)
            throw error;
        }
        
    }

    public async UploadGroupMedia(group_openid: string, file_info: UploadMediaRequest): Promise<UploadMediaResponse>{
        try {
            const path: string = `/v2/groups/${group_openid}/files`
            const response: UploadMediaResponse = await this.SendQQRequest_<UploadMediaResponse,UploadMediaRequest>(path,file_info);
            
            logger.log(`Successfully uploaded a file for the group(${group_openid}) (File UUID: ${response.file_uuid})`);
            return response;
        } catch (error) {
            logger.error(`[${this.name_}]` + (error as Error).message)
            throw error;
        }
    }

    
}