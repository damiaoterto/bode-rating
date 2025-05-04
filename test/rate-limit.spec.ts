import { randomUUID } from 'node:crypto'
import express, { type Express, type Request, type Response } from 'express'
import request from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'
import { rating } from '../src/rate-limit'

describe('RateLimit', () => {
	let app: Express
	const resultMock = [
		{
			id: randomUUID().toString(),
			age: 34,
		},
		{
			id: randomUUID().toString(),
			age: 43,
		},
	]

	beforeEach(() => {
		app = express()
	})

	it('should block requests if they exceed the limits using global middleware', async () => {
		// set global middleware
		app?.use(rating({ max: 10 }))

		// create test rote
		app?.get('/test', (req: Request, res: Response) => {
			res.json(resultMock)
		})

		// send 10 request to to achieve the maximum
		const requests = Array.from({ length: 10 }).map(async () => {
			await request(app).get('/test')
		})

		await Promise.all(requests)
		// send 1 more request to return error
		const response = await request(app).get('/test')

		expect(response.status).toBe(429)
		expect(response.body.success).toBeFalsy()
		expect(response.body.message).toBe('Too many requests, please try again later.')
	})

	it('should block requests if they exceed the limits using default params', async () => {
		// set global middleware
		app?.use(rating())

		// create test rote
		app?.get('/test', (req: Request, res: Response) => {
			res.json(resultMock)
		})

		// send 10 request to to achieve the maximum
		const requests = Array.from({ length: 100 }).map(async () => {
			await request(app).get('/test')
		})

		await Promise.all(requests)
		// send 1 more request to return error
		const response = await request(app).get('/test')

		expect(response.status).toBe(429)
		expect(response.body.success).toBeFalsy()
		expect(response.body.message).toBe('Too many requests, please try again later.')
	})

	it('should block requests if they exceed the limits using routing middleware', async () => {
		// create test rote
		app?.get('/test', rating({ max: 10 }), (req: Request, res: Response) => {
			res.json(resultMock)
		})

		// send 10 request to to achieve the maximum
		const requests = Array.from({ length: 10 }).map(async () => {
			await request(app).get('/test')
		})

		await Promise.all(requests)
		// send 1 more request to return error
		const response = await request(app).get('/test')

		expect(response.status).toBe(429)
		expect(response.body.success).toBeFalsy()
		expect(response.body.message).toBe('Too many requests, please try again later.')
	})

	it('should check rate limiting headers', async () => {
		const max = 10

		// create test rote
		app?.get('/test', rating({ max }), (req: Request, res: Response) => {
			res.json(resultMock)
		})

		// send 10 request to to achieve the maximum
		const requests = Array.from({ length: 4 }).map(async () => {
			await request(app).get('/test')
		})

		await Promise.all(requests)
		// send 1 more request to return error
		const response = await request(app).get('/test')

		expect(response.headers['x-ratelimit-limit']).toBe(max.toString())
		expect(response.headers['x-ratelimit-remaining']).toBe('5')
		expect(response.body).toMatchObject(resultMock)
	})

	it('should change cache engine options', async () => {
		const mussurana = {
			maxMemory: 100 * 1024,
			maxItems: 100,
			checkPeriod: 60000,
		}

		// set global middleware
		app?.use(rating({ max: 10, mussurana }))

		// create test rote
		app?.get('/test', (req: Request, res: Response) => {
			res.json(resultMock)
		})

		// send 10 request to to achieve the maximum
		const requests = Array.from({ length: 10 }).map(async () => {
			await request(app).get('/test')
		})

		await Promise.all(requests)
		// send 1 more request to return error
		const response = await request(app).get('/test')

		expect(response.status).toBe(429)
		expect(response.body.success).toBeFalsy()
		expect(response.body.message).toBe('Too many requests, please try again later.')
	})
})
