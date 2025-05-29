import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { splitVendorChunkPlugin } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(), // Split vendor chunks for better caching
  ],
  build: {
    // Generate source maps for production
    sourcemap: true,

    // Minify output
    minify: "terser",

    // Terser options
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true, // Remove debugger statements
      },
    },

    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,

    // Output directory
    outDir: "dist",

    // Asset file name format
    rollupOptions: {
      output: {
        // Chunk files
        manualChunks: {
          // Split React into a separate chunk
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          // Split Redux into a separate chunk
          "redux-vendor": ["@reduxjs/toolkit", "react-redux"],
        },
        // Asset file naming
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split(".").at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = "img";
          } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
            extType = "fonts";
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        // Entry chunk file naming
        entryFileNames: "assets/js/[name]-[hash].js",
        // Chunk file naming
        chunkFileNames: "assets/js/[name]-[hash].js",
      },
    },

    // Enable CSS code splitting
    cssCodeSplit: true,

    // Enable CSS minification
    cssMinify: true,
  },
  // Development server options
  server: {
    port: 5173,
    strictPort: true,
    open: true,
    cors: true,
    // Proxy API requests to backend during development
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Preview server options (for previewing production builds)
  preview: {
    port: 8080,
    strictPort: true,
    open: true,
  },
});
