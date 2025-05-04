import { rating } from '@/rate-limit'
import type { RateLimitOptions } from '@/rate-limit.interface'
import express, { type Express } from 'express'

export class MockExpress {
	private route: string
	private readonly app: Express

	constructor() {
		this.app = express()
		this.route = '/test'
	}

	setRoute(route: string): this {
		this.route = route
		return this
	}

	createWithGlobalMiddleware(opts?: RateLimitOptions, cb?: () => void): this {
		this.app.use(rating(opts))
		this.app.get(this.route, (req, res) => {
			if (cb) cb()
			res.json({ success: true })
		})
		return this
	}

	createWithRouteMiddleware(opts?: RateLimitOptions, cb?: () => void): this {
		this.app.get(this.route, rating(opts), (req, res) => {
			if (cb) cb()
			res.json({ success: true })
		})
		return this
	}

	getApp(): Express {
		return this.app
	}
}
