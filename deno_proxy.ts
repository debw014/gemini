// proxy_server.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const TARGET_URL = "https://generativelanguage.googleapis.com"; // ✅ 无空格

const handler = async (request: Request): Promise<Response> => {
  try {
    const url = new URL(request.url);
    let targetPath = url.pathname.replace(/^\/proxy/, ""); // 移除 /proxy 前缀（支持 /proxy 或 /proxy/）
    if (targetPath === "") {
      return new Response("Proxy path required", { status: 400 });
    }

    // 使用 URL 构造器安全拼接
    const target = new URL(targetPath, TARGET_URL);
    target.search = url.search; // 保留查询参数（如 ?key=...）

    const init: RequestInit = {
      method: request.method,
      headers: new Headers(request.headers),
      body: request.body,
    };

    // 确保 Content-Type（可选，但推荐）
    if (!init.headers.has("Content-Type") && request.body) {
      init.headers.set("Content-Type", "application/json");
    }

    const response = await fetch(target.toString(), init);

    // 转发响应
    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(`Proxy error: ${error.message}`, { status: 500 });
  }
};

serve(handler, { port: 8000 });
console.log("Proxy server running on http://localhost:8000");
