import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-public-site-index',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url && /^\/site\/?(\?.*)?$/.test(req.url)) {
            req.url = '/site/index.html'
          }
          next()
        })
      },
    },
  ],
  assetsInclude: ['**/*.csv'],
})
