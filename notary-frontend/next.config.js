const crypto = require('crypto');

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Only fail on errors during build, not warnings
        ignoreDuringBuilds: false,
    },
    typescript: {
        // Dangerously allow production builds to complete even if there are type errors
        ignoreBuildErrors: false,
    },
    serverExternalPackages: ['@supabase/supabase-js'],
    env: {
        CUSTOM_KEY: process.env.CUSTOM_KEY,
    },
    output: 'standalone',
    trailingSlash: false,
    generateBuildId: async() => {
        return 'notary-app-build'
    },
    // Fix for ChunkLoadError
    webpack: (config, { dev, isServer }) => {
        if (!dev && !isServer) {
            // Ensure consistent chunk naming
            config.optimization = {
                ...config.optimization,
                splitChunks: {
                    ...config.optimization.splitChunks,
                    cacheGroups: {
                        ...config.optimization.splitChunks.cacheGroups,
                        default: false,
                        vendors: false,
                        framework: {
                            chunks: 'all',
                            name: 'framework',
                            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
                            priority: 40,
                            enforce: true,
                        },
                        lib: {
                            test(module) {
                                return module.size() > 160000 && /node_modules[/\\]/.test(module.identifier());
                            },
                            name: (module) => {
                                const hash = crypto.createHash('sha1');
                                hash.update(module.libIdent ? module.libIdent({ context: config.context }) : module.identifier());
                                return hash.digest('hex').substring(0, 8);
                            },
                            priority: 30,
                            minChunks: 1,
                            reuseExistingChunk: true,
                            chunks: 'all',
                        },
                        commons: {
                            name: 'commons',
                            minChunks: 2,
                            priority: 20,
                            chunks: 'all',
                            reuseExistingChunk: true,
                        },
                    },
                },
            };
        }
        return config;
    },
    // Better image optimization
    images: {
        domains: [],
        formats: ['image/webp', 'image/avif'],
    },
}

module.exports = nextConfig