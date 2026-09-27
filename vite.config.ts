import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        base: env.VITE_STATIC_BASE_URL || '/',
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@app': path.resolve(__dirname, './src/app'),
                '@api': path.resolve(__dirname, './src/api'),
                '@pages': path.resolve(__dirname, './src/pages'),
                '@widgets': path.resolve(__dirname, './src/widgets'),
                '@stores': path.resolve(__dirname, './src/stores'),
                '@composables': path.resolve(__dirname, './src/composables'),
                '@shared': path.resolve(__dirname, './src/shared'),
            },
        },
        plugins: [ vue() ],
        server: {
            allowedHosts: ['frontend.dev.test']
        }
    };
});
