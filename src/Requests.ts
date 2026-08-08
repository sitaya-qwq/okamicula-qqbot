import { HandleQQBotRequest } from "./QQBot/QQBot";
import { Payload } from "./Types/QQBot/Payload";

export async function HandleRequest(request: Request, ctx: ExecutionContext): Promise<Response>
{
    const url: URL = new URL(request.url);
    const method = request.method;
    const path: string = url.pathname;

    
    if (path === "/")
    {
        return new Response("Salvē ab Ōkamiculā!",{status:200});
    }
    else if(path === "/webhook/qq")
    {
        if (method === "GET")
        {
            return new Response("Okamicula is OK!",{status: 200});
        }
        if (method === "POST")
        {
            try
            {
                // 先检查 Content-Type
                const contentType = request.headers.get("content-type") || "";
                if (!contentType.includes("application/json")) 
                {
                    return new Response(
                        JSON.stringify({ 
                            error: "Content-Type must be application/json" 
                        }),
                        { 
                            status: 400, 
                            headers: { "Content-Type": "application/json" } 
                        }
                    );
                }

                // 安全解析 JSON
                let payload: Payload;
                try 
                {
                    payload = await request.json();
                } catch (jsonError) 
                {
                    console.error("[Requests] JSON parse error:", jsonError);
                    return Response.json(
                        {
                            error: "Invalid JSON payload",
                            detail: "Request body must be valid JSON"
                        },
                        { 
                            status: 400, 
                            headers: { "Content-Type": "application/json" } 
                        }
                    );
                }

                // 验证 payload 不为空
                if (!payload || typeof payload !== "object") 
                {
                    return Response.json(
                        { error: "Empty or invalid payload" },
                        { 
                            status: 400, 
                            headers: { "Content-Type": "application/json" } 
                        }
                    );
                }

                // 传递给处理函数
                return HandleQQBotRequest(payload,ctx);
                
            } catch (error) {
                console.error("[Requests] Unhandled error:", error);
                return new Response(
                    JSON.stringify({ 
                        error: "Internal server error",
                        detail: error instanceof Error ? error.message : String(error)
                    }),
                    { 
                        status: 500, 
                        headers: { "Content-Type": "application/json" } 
                    }
                );
            }
        }
    }
    return new Response("Nihil Ōkamicula invenit...",{status: 404})
}