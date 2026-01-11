import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Static export for GitHub Pages deployment
    output: 'export',

    // Image optimization (disable for static export)
    images: {
        unoptimized: true,
    },

    // Disable strict mode for development (optional)
    reactStrictMode: true,

    // Transpile workspace packages
    transpilePackages: ['@ticketapp/ui', '@ticketapp/utils'],
};

export default nextConfig;
