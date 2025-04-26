// 目标反向代理地址
const TARGET_ORIGIN = 'https://generativelanguage.googleapis.com';
// 你希望代理服务监听的端口
const LISTEN_PORT = 8000;

// 请求处理函数
async function handler(request: Request): Promise<Response> {
  try {
    // 从传入请求的 URL 中获取路径和查询参数
    const url = new URL(request.url);
    const path = url.pathname;
    const search = url.search;

    // 构建目标 URL
    const targetUrl = TARGET_ORIGIN + path + search;

    // 创建一个新的请求对象，目标是 TARGET_ORIGIN
    // 保留原始请求的方法、Headers 和 Body
    // Deno 的 fetch 会自动处理一些 Headers
    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body, // 保留请求体
      redirect: 'follow', // 根据需要设置重定向行为
      // 如果需要自定义其他 fetch 选项，可以在这里添加
      // 例如：timeout
    });

    // 发送请求到目标地址并等待响应
    console.log(`Proxying request to: ${targetUrl}`);
    const response = await fetch(newRequest);

    // 将从目标地址获取的响应返回给客户端
    // 可以选择在这里修改响应头等
    console.log(`Received response status: ${response.status} from ${targetUrl}`);
    return response;

  } catch (error) {
    // 捕获 fetch 或其他处理过程中发生的错误
    console.error('Error handling request:', error);

    // 返回一个错误响应给客户端
    return new Response('Internal Server Error', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

// 启动 Deno HTTP 服务器
console.log(`Starting proxy server on http://localhost:${LISTEN_PORT}`);
//
