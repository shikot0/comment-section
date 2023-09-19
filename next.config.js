/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
      esmExternals: "loose", 
      serverComponentsExternalPackages: ["mongoose"]
    },
    images: {
      // unoptimized: process.env.NODE_ENV === 'production',
      domains: ['', '/', 'localhost', '192.168.0.191', 'hostname'],
    },

    webpack: (config) => {
      config.experiments = {
        ...config.experiments,
        topLevelAwait: true,
        layers: true,
      };
      return config;
    },
  }

module.exports = nextConfig
