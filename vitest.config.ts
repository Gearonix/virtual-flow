/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  cacheDir: '../../node_modules/.vite/virtual-flow',
  test: {
    globals: true,
    cache: {
      dir: 'node_modules/.vitest'
    },
    coverage: {
      provider: 'c8'
    },
    environment: 'jsdom',
    include: ['src/*.test.{ts,tsx}']
  }
})
