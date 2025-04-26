// proxy_server.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const TARGET_URL = "https://generativelanguage.googleapis.com";

const handler = async (request: Request): Promise<Response> => {
  try {
    // 构造目标 URL
    const url = new URL(request.url);
    const targetPath = url.pathname.replace("/proxy/", ""); // 移除代理路径前缀
    const targetUrl = `${TARGET_URL}/${targetPath}${url.search}`;

    // 转发请求
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    // 返回响应
    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    return new Response(`Proxy error: ${error.message}`, { status: 500 });
  }
};

// 启动服务器
serve(handler, { port: 8000 });
console.log("Proxy server running on http://localhost:8000");
