import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import react             from '@vitejs/plugin-react'
import { resolve }       from 'node:path'
import tsconfigPaths     from 'vite-tsconfig-paths'
import { defineConfig }  from 'vitest/config'

export default defineConfig({
  cacheDir: '../../node_modules/.vite/virtual-flow',
  plugins: [react(), nxViteTsPaths(), tsconfigPaths()],
  test: {
    globals: true,
    cache: {
      dir: 'node_modules/.vitest'
    },
    coverage: {
      provider: 'c8'
    },
    environment: 'jsdom',
    include: ['src/__tests__/**/*.test.{ts,tsx}']
  }
})
