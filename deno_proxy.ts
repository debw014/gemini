// proxy_server.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const TARGET_URL = "https://generativelanguage.googleapis.com"; // 无空格！

const handler = async (request: Request): Promise<Response> => {
  try {
    const url = new URL(request.url);
    let targetPath = url.pathname.replace(/^\/proxy/, ""); // 移除 /proxy 前缀
    if (targetPath === "") {
      return new Response("Proxy path required", { status: 400 });
    }

    const target = new URL(targetPath, TARGET_URL);
    target.search = url.search; // 保留 ?key=... 等参数

    // 直接转发请求
    const proxyRequest = new Request(target.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      // 重要：保持 redirect 行为一致（通常不需要）
    });

    // 直接返回 fetch 的响应（自动处理流、头、状态码）
    const response = await fetch(proxyRequest);

    // 可选：记录状态便于调试
    console.log(`${request.method} ${target.toString()} -> ${response.status}`);

    return response; // ✅ 直接返回，不要 new Response(response.body, ...)
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(`Proxy error: ${error.message}`, { status: 500 });
  }
};

serve(handler, { port: 8000 });
console.log("Proxy server running on http://localhost:8000");
