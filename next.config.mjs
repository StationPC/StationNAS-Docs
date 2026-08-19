import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // standalone 输出：产出可直接运行的 server.js，供 Docker 化部署使用
  output: 'standalone',
};

export default withMDX(config);
