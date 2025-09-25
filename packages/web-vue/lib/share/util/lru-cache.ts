export function createLRU<K = string, V = any>(max: number) {
	if (!Number.isInteger(max) || max <= 0) {
		throw new RangeError('max must be a positive integer')
	}
	const cache = new Map<K, V>()
	return {
		get(key: K): V | undefined {
			const val = cache.get(key)
			if (val === undefined) return undefined
			cache.delete(key)
			cache.set(key, val)
			return val
		},
		set(key: K, value: V) {
			if (cache.has(key)) cache.delete(key)
			else if (cache.size >= max) cache.delete(cache.keys().next().value as K)
			cache.set(key, value)
		},
		delete(key: K): boolean {
			return cache.delete(key)
		},
		clear() {
			cache.clear()
		},
		has(key: K): boolean {
			return cache.has(key)
		},
		get size(): number {
			return cache.size
		}
	}
}
