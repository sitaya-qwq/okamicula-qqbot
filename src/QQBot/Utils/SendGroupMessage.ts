import { GetAccessToken } from "./AccessToken";

// ========== 发送私聊消息函数 ==========
export async function SendGroupMessage(
    group_openid: string,
    content: string,
    env: Env,
    msg_id?: string
) {
    try {
        // 1. 参数校验
        if (!group_openid) {
            console.error('[SendGroupMessage] 缺少 group_openid');
            return;
        }

        // 2. 从环境变量获取配置
        const baseUrl = env.QQBOT_URL;
        if (!baseUrl) {
            console.error('[SendGroupMessage] 缺少 QQBOT_URL');
            return;
        } 

        const accessToken = await GetAccessToken(env);
        if (!accessToken) {
            console.error('[SendGroupMessage] 获取 Access Token 失败');
            return;
        }

        if (!content) {
            console.error('[SendGroupMessage] 缺少 content');
            return;
        }           


        // 3. 构建完整 URL（注意：不再需要 /v2，因为 baseUrl 已经包含）
        const url = `${baseUrl}/groups/${group_openid}/messages`;


        // 4. 构建请求体
        const body: any = {
            content: content,
            msg_type: 0  // 0=文本消息
        };

        

        // 被动回复时带上 msg_id
        if (msg_id) {
            body.msg_id = msg_id;
            body.msg_seq = 1;  // 回复序号，避免重复发送
        }

        console.log(`[SendGroupMessage] 发送消息到: ${url}`);

        // 5. 发起请求
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `QQBot ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        // 6. 处理响应
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[SendGroupMessage] 发送失败: ${response.status}`, errorText);

            // ✅ 如果是 401（Token 过期），清除缓存
            if (response.status === 401) {
                console.warn('[SendGroupMessage] Token 已过期，清除缓存');
                const { ClearTokenCache } = await import('./AccessToken');
                ClearTokenCache();
            }
            return;
        }

        const result = await response.json();
        console.log(`[发送消息成功] 到 ${group_openid}: ${content}`);
        return result;

    } catch (error) {
        console.error('[发送消息异常]:', error);
        throw error;
    }
}