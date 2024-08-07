/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /\.glsl$/i,
      loader: "raw-loader",
    });

    return config;
  },
};

export default nextConfig;
