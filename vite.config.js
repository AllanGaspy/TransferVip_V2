import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true
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