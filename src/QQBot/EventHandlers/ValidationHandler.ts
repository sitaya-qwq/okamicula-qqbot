import { EventHandler, Payload } from '../Types/BasicTypes';
import { GenerateEd25519Signature, VerifyEd25519Signature } from '../Utils/Signature';

export const HandleValidation: EventHandler<{ plain_token: string; event_ts: string }> = 
    async (payload: Payload, env: Env, ctx: ExecutionContext) => 
    {
        try
        {
            const { plain_token, event_ts } = (payload.d as any);
            const botSecret: string = env.BOT_SECRET.trim();
            
            if (!botSecret) {
                console.error('BOT_SECRET 未配置');
                return new Response('Server configuration error', { status: 500 });
            }

            // 生成签名
            const signature = GenerateEd25519Signature(
                botSecret,
                plain_token,
                event_ts
            );

            // ✅ 自检：验证生成的签名是否正确（可选）
            const isValid = VerifyEd25519Signature(
                botSecret,
                plain_token,
                event_ts,
                signature
            );

            if (!isValid) {
                console.error('生成的签名验证失败');
                return new Response('Internal signature error', { status: 500 });
            }

            // 返回验证响应
            return Response.json({plain_token,signature},{status: 200});
        }
        catch (error)
        {
            console.error('验证处理异常:', error);
            return new Response('Internal server error', { status: 500 });
        }
    };