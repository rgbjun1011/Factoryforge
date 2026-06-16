/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 不需要 API 路由 - 所有第三方 API 都支持 CORS
  // 避开 Next.js 14 (group) route pickup 的 bug
};

module.exports = nextConfig;
