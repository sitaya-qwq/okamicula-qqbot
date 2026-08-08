export enum OperateCode
{
    Dispatch = 0,            // 服务端消息推送 (Receive)
    Heartbeat = 1,           // 心跳 (Send/Receive)
    Identify = 2,            // 客户端鉴权 (Send)
    Resume = 6,              // 客户端恢复连接 (Send)
    Reconnect = 7,           // 服务端通知重连 (Receive)
    InvalidSession = 9,      // 无效会话 (Receive)
    Hello = 10,              // 网关 Hello (Receive)
    HeartbeatACK = 11,       // 心跳确认 (Receive/Reply)
    HTTPCallbackACK = 12,    // HTTP 回调回包 (Reply)
    URLValidation = 13,      // 回调地址验证 (Receive)
}