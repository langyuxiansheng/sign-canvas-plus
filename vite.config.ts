// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx'; // pnpm add -D @vitejs/plugin-vue-jsx
import path from "path";
import dts from 'vite-plugin-dts';

const resolve = (dir: string) => path.join(__dirname, dir);
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx({}),
        dts()
    ],
    resolve: {
        alias: {
            "@": resolve("examples"),
            packages: resolve("packages"),
        },
    },
    build: {
        outDir: 'lib',
        rollupOptions: {
            // 请确保外部化那些你的库中不需要的依赖
            external: ['vue'],
            output: {
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    vue: 'Vue',
                },
            },
        },
        lib: {
            entry: 'packages/index.ts',
            name: 'sign-canvas-plus',
            fileName: (format) => `sign-canvas-plus.${format}.js`,
        },
    },
})
