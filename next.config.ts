import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    // 在Docker环境中禁用图片优化，避免容器间连接问题
    unoptimized: true,
  },
};

export default nextConfig;
