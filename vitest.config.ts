/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'json'],
    },
  },
})
