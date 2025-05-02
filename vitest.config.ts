/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  test: {
    coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'json'],
    },
  },
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
		},
	},
})
