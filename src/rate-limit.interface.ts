export interface MussuranaCache {
	maxMemory?: number
	maxItems?: number
	checkPeriod?: number
}

export interface RateLimitOptions {
	max?: number
	window?: number
	mussurana?: MussuranaCache
}
