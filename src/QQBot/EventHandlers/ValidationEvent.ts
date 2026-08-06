import nacl from 'tweetnacl';
import { ValidationData } from '../Types/QQBotTypes/BasicTypes';
import { BaseEvent } from './BaseEvent';

export class ValidationEvent extends BaseEvent<ValidationData> {
    public async Handle(): Promise<Response> {
        try
        {
            const { plain_token, event_ts } = (this._data as ValidationData);
            const botSecret: string = this._env.BOT_SECRET.trim();
            
            if (!botSecret) {
                console.error('BOT_SECRET 未配置');
                return new Response('Server configuration error', { status: 500 });
            }

            // 生成签名
            const signature = this.GenerateEd25519Signature(
                botSecret,
                plain_token,
                event_ts
            );

            const isValid = this.VerifyEd25519Signature(
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
    }

    private GenerateEd25519Signature(botSecret: string,plainToken: string,eventTs: string): string {
        let seed = botSecret;
        const SEED_SIZE = 32;
        while (Buffer.byteLength(seed, 'utf8') < SEED_SIZE) {
            seed = seed + seed;
        }
        seed = seed.slice(0, SEED_SIZE);
        const seedBuffer = Buffer.from(seed, 'utf8');

        // 从 seed 生成密钥对
        const keyPair = nacl.sign.keyPair.fromSeed(seedBuffer);

        // 构造消息: event_ts + plain_token
        const message = eventTs + plainToken;
        const messageBuffer = Buffer.from(message, 'utf8');

        // 生成签名 (detached 模式)
        const signatureBuffer = nacl.sign.detached(messageBuffer, keyPair.secretKey);

        return Buffer.from(signatureBuffer).toString('hex');
    }    

    private VerifyEd25519Signature(botSecret: string,plainToken: string,eventTs: string,signatureHex: string): boolean {
        try {
            // ✅ 方法 2：重复填充直到 32 字节
            let seed = botSecret;
            const SEED_SIZE = 32;
            while (Buffer.byteLength(seed, 'utf8') < SEED_SIZE) {
                seed = seed + seed;
            }
            seed = seed.slice(0, SEED_SIZE);
            const seedBuffer = Buffer.from(seed, 'utf8');

            // 生成密钥对
            const keyPair = nacl.sign.keyPair.fromSeed(seedBuffer);

            // 构造消息和签名
            const message = eventTs + plainToken;
            const messageBuffer = Buffer.from(message, 'utf8');
            const signatureBuffer = Buffer.from(signatureHex, 'hex');

            // 验证
            return nacl.sign.detached.verify(
                messageBuffer,
                signatureBuffer,
                keyPair.publicKey
            );
        } catch (error) {
            console.error('验证签名失败:', error);
            return false;
        }
    }

}
