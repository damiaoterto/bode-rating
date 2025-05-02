/// <reference types="vitest/config" />

import { resolve } from 'node:path'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		coverage: {
			provider: 'v8',
			reporter: ['clover', 'html'],
			exclude: [
				...configDefaults.exclude,
				'**/node_modules/**',
				'./src/index.ts',
				'./src/**/*.interface.ts',
			],
		},
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
			'@test': resolve(__dirname, 'test'),
		},
	},
})
