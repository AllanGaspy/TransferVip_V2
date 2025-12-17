import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/TransferVip_V2-1/api')
      },
      '/contato': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: () => '/TransferVip_V2-1/views/contato.html'
      },
      '/servicos': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: () => '/TransferVip_V2-1/views/servicos.html'
      },
      '/frota-executivos': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: () => '/TransferVip_V2-1/views/frota-executivos.html'
      },
      '/frota-blindados': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: () => '/TransferVip_V2-1/views/frota-blindados.html'
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        frotaExecutivos: 'views/frota-executivos.html',
        frotaBlindados: 'views/frota-blindados.html',
        servicos: 'views/servicos.html',
        contato: 'views/contato.html'
      }
    }
  }
})
