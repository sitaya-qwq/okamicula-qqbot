import { env } from "cloudflare:workers";

interface TokenResponse {
    access_token: string;
    expires_in: number;
}

let tokenCache: { token: string; expiresAt: number } | null = null;

export async function GetAccessToken(): Promise<string> {
    try {
        if (tokenCache && tokenCache.expiresAt > Date.now()) {
            console.log('[GetAccessToken] 使用缓存的 Token');
            return tokenCache.token;
        }

        const appId = env.BOT_APPID;
        const appSecret = env.BOT_SECRET;
        const baseUrl = env.QQBOT_TOKEN_URL;

        if (!appId || !appSecret) {
            console.error('[GetAccessToken] 缺少 BOT_APPID 或 BOT_SECRET');
            return '';
        }

        const url = `${baseUrl}/app/getAppAccessToken`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                appId: appId,
                clientSecret: appSecret
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[GetAccessToken] 请求失败: ${response.status}`, errorText);
            return '';
        }

        const data: TokenResponse = await response.json();

        const bufferMs = 5 * 60 * 1000;
        tokenCache = {
            token: data.access_token,
            expiresAt: Date.now() + (data.expires_in * 1000) - bufferMs
        };

        console.log(`[GetAccessToken] 获取成功，有效期 ${data.expires_in} 秒`);
        return data.access_token;

    } catch (error) {
        console.error('[GetAccessToken] 异常:', error);
        return '';
    }
}

export function ClearTokenCache(): void {
    tokenCache = null;
    console.log('[ClearTokenCache] Token 缓存已清除');
}