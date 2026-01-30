import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import svgLoader from 'vite-svg-loader';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@scripts": path.resolve(__dirname, "./src/scripts") // <-- rinominato
    }
  },
  build: {
    cssCodeSplit: true,
    manifest: 'manifest.json',
    outDir: 'dist',
    rollupOptions: {
      output: {
          assetFileNames: '[name]-[hash].[ext]',
          chunkFileNames: '[name]-[hash].js',
          entryFileNames: '[name]-[hash].js'
      },
      input: {
        main: 'src/scripts/main.ts',
        editorCustomizer: 'src/scripts/editorCustomizer.ts',
        professionalBlock: 'blocks/professional/index.ts',
        professionalsGridBlock: 'blocks/professionals-grid/index.ts'
      }
    },
    // Rimuove console.log in build usando esbuild (nativo)
    minify: 'esbuild',
    target: 'esnext'
  },
  esbuild: {
    // TODO : Configurare per rimuovere console.log in produzione
    // Rimuove console.log ma mantiene info, warn, error
    //drop: ['console', 'debugger'],
    //pure: ['console.log', 'console.debug']
  },
  css: {
    devSourcemap: true
  },
  plugins: [
    svgLoader({
      defaultImport: 'raw'
    })
  ],
  server: {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: '*'
    },
    strictPort: true,
    port: parseInt(process.env.VITE_PORT || '5173', 10)
  }
});