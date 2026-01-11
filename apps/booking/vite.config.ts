import { defineConfig, loadEnv } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
    // Load env file from root directory
    const envDir = path.resolve(__dirname, '../..');
    const env = loadEnv(mode, envDir, '');

    // Set environment variables for server-side code
    process.env.VITE_STRIPE_SECRET_KEY = env.VITE_STRIPE_SECRET_KEY;
    process.env.STRIPE_SECRET_KEY = env.VITE_STRIPE_SECRET_KEY;

    return {
        envDir,
        plugins: [
            tailwindcss(),
            sveltekit()
        ],
        server: {
            port: 4202,
            host: 'localhost',
        },
        esbuild: {
            tsconfigRaw: {
                compilerOptions: {
                    experimentalDecorators: true,
                    useDefineForClassFields: false,
                },
            },
        },
        optimizeDeps: {
            exclude: ['@ticketapp/ui'],
            esbuildOptions: {
                tsconfigRaw: {
                    compilerOptions: {
                        experimentalDecorators: true,
                        useDefineForClassFields: false,
                    },
                },
            },
        },
    };
});
