/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    agentUpgrade: "security",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
