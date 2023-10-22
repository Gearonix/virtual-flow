import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import react             from '@vitejs/plugin-react'
import { resolve }       from 'node:path'
import { defineConfig }  from 'vite'
import tsconfigPaths     from 'vite-tsconfig-paths'

export default defineConfig({
  cacheDir: '../node_modules/.vite/dev',

  server: {
    port: 3000
  },

  plugins: [
    react(),
    nxViteTsPaths(),
    tsconfigPaths({ root: resolve(__dirname, '..') })
  ]
})
