// src/QQBot/Utils/Signature.ts
import nacl from 'tweetnacl';

/**
 * 生成 Ed25519 签名 (用于 URL 验证)
 */
export function GenerateEd25519Signature(
    botSecret: string,
    plainToken: string,
    eventTs: string
): string {
    // ✅ 方法 2：重复填充直到 32 字节（与官方 Go 的 strings.Repeat 一致）
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

/**
 * 验证 Ed25519 签名
 */
export function VerifyEd25519Signature(
    botSecret: string,
    plainToken: string,
    eventTs: string,
    signatureHex: string
): boolean {
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