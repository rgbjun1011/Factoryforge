/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 纯静态导出 - 适配 Cloudflare Pages / GitHub Pages 等静态托管
  // 不需要服务端运行时，文件全在 out/ 目录
  output: "export",
  // 不需要 API 路由 - 所有第三方 API 调用都支持 CORS
  // 避开 Next.js 14 (group) route pickup 的 bug
  images: {
    unoptimized: true, // static export 必须
  },
  trailingSlash: true, // 静态托管友好
};

module.exports = nextConfig;
