import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import react             from '@vitejs/plugin-react'
import { defineConfig }  from 'vite'

export default defineConfig({
  cacheDir: '../node_modules/.vite/dev',

  server: {
    port: 3000
  },

  plugins: [react(), nxViteTsPaths()]
})
