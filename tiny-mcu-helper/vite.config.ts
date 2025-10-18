import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  base: process.env.TAURI_BUILD_MODE === "dev" ? "/" : "./",
  resolve: {
    // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, './src'), // 将 @ 指向 src 目录
      '@components': path.resolve(__dirname, './src/components'), // 将 @ 指向 src 目录
      '@views': path.resolve(__dirname, './src/views'), // 将 @ 指向 src 目录
      '@layouts': path.resolve(__dirname, './src/layouts'), // 将 @ 指向 src 目录
      '@styles': path.resolve(__dirname, './src/styles'), // 将 @ 指向 src 目录
      '@routes': path.resolve(__dirname, './src/routes'), // 将 @ 指向 src 目录
      '@stores': path.resolve(__dirname, './src/stores'), // 将 @ 指向 src 目录
      '@utils': path.resolve(__dirname, './src/utils'), // 将 @ 指向 src 目录
      '@data': path.resolve(__dirname, './src/data'), // 将 @ 指向 src 目录
    },
  },
  plugins: [react(), tailwindcss()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
        ? {
          protocol: "ws",
          host,
          port: 1421,
        }
        : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
