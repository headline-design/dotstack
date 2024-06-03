/** @type {import('next').NextConfig} */
const nextConfig = {

  experimental: {
    esmExternals: true,
  },
  transpilePackages: ['@polkadot/types', '@polkadot/api', '@azns/resolver-core'],

}

module.exports = nextConfig
