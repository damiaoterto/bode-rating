import request from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'
import { MockExpress } from './mock-express.mock'

describe('Rating', () => {
	let mockExpress: MockExpress

	beforeEach(() => {
		mockExpress = new MockExpress()
	})

	it('should block requests if they reach the maximum limit with default options', async () => {
		const route = '/test'
		const requests = 100
		const app = mockExpress.createWithGlobalMiddleware().getApp()

		const sendRequests = Array.from({ length: requests }).map(async () => {
			return request(app).get(route)
		})

		await Promise.all(sendRequests)

		const response = await request(app).get(route)

		expect(response.status).toBe(429)
		expect(response.body.message).toBe('Too many requests, please try again later.')
	})

	it('should block requests if they reach the maximum limit with set options', async () => {
		const route = '/test'
		const max = 40
		const app = mockExpress.createWithGlobalMiddleware({ max, window: 30 }).getApp()

		const sendRequests = Array.from({ length: max }).map(async () => {
			return request(app).get(route)
		})

		await Promise.all(sendRequests)

		const response = await request(app).get(route)

		expect(response.status).toBe(429)
		expect(response.body.message).toBe('Too many requests, please try again later.')
	})

	it('should get rating headers', async () => {
		const route = '/test'
		const max = 40
		const expectedRemaining = (max - 1).toString()
		const app = mockExpress.createWithRouteMiddleware({ max }).getApp()

		const response = await request(app).get(route)

		expect(response.status).toBe(200)
		expect(response.headers['x-ratelimit-limit']).toBe(max.toString())
		expect(response.headers['x-ratelimit-remaining']).toBe(expectedRemaining)
	})

	it('should get rating headers with set cache engine options', async () => {
		const route = '/test'
		const max = 40
		const expectedRemaining = (max - 1).toString()
		const mussurana = { maxItens: 400, checkPeriod: 10000, maxMemory: 10 * 1024 * 1024 }
		const app = mockExpress.createWithGlobalMiddleware({ max, mussurana }).getApp()

		const response = await request(app).get(route)

		expect(response.status).toBe(200)
		expect(response.headers['x-ratelimit-limit']).toBe(max.toString())
		expect(response.headers['x-ratelimit-remaining']).toBe(expectedRemaining)
	})
})
