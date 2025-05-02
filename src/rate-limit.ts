import type { NextFunction, Request, Response } from 'express'
import { MussuranaCache } from 'mussurana-cache'
import { RL_DEFAULT_OPTIONS, RL_KEY_PREFIX } from './constants'
import type { RateLimitOptions } from './rate-limit.interface'

export const rating = (options?: RateLimitOptions) => {
	const max = options?.max || RL_DEFAULT_OPTIONS.max
	const window = options?.window || RL_DEFAULT_OPTIONS.window
	const cacheOptions = options?.mussurana || RL_DEFAULT_OPTIONS.mussurana

	const cache = new MussuranaCache(cacheOptions)

	return (req: Request, res: Response, next: NextFunction) => {
		const ip = req.ip
		const key = `${RL_KEY_PREFIX}:${ip}`

		const currentWindow = Math.floor(Date.now() / 1000 / window) * window

		const currentValue = cache.get(key) || '0:0'
		const [count, windowStart] = currentValue.split(':').map(Number)

		if (windowStart < currentWindow) {
			cache.set(key, `1:${currentWindow}`, window)
		} else {
			const newCount = count + 1
			if (newCount > max) {
				res.status(429).json({
					success: false,
					message: 'Too many requests, please try again later.',
				})
				return
			}

			cache.set(key, `${newCount}:${currentWindow}`, window)
		}

		res.setHeader('X-RateLimit-Limit', max)
		res.setHeader('X-RateLimit-Remaining', max - (count + 1))
		res.setHeader('X-RateLimit-Reset', currentWindow + window)

		next()
	}
}
