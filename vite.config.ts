import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { defineConfig }  from 'vite'

export default defineConfig({
  cacheDir: './node_modules/.vite/project',

  plugins: [nxViteTsPaths()]
})
