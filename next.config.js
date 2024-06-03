/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    esmExternals: true,
  },
  transpilePackages: ['@polkadot/types', '@polkadot/api', '@azns/resolver-core'],

  typescript: {
    ignoreBuildErrors: true,
  },

}

module.exports = nextConfig
