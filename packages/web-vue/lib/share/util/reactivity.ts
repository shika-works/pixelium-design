import { isArray, isFunction, isObjectLike, type Nullish } from 'parsnip-kit'
import { computed, isRef, type Ref, type UnwrapRef, type EmitsOptions } from 'vue'

type Provides<T extends string, K extends any> = (
	| { [key in T]: K | Ref<K> }
	| false
	| Nullish
)[]

export const createProvideComputed = <
	T extends string,
	K extends any,
	const P extends Provides<T, K>,
	const V extends UnwrapRef<Exclude<P[number], false | Nullish>[T]> | undefined
>(
	key: T,
	provides: (() => P) | P,
	mergeType: 'nullish' | 'or' | ((pre: V, value: V, cur: P[number] & object) => any) = 'nullish'
) => {
	return computed(() => {
		const curProvides = isFunction(provides) ? provides() : provides
		const provideValues = curProvides.filter((provide: P[number]) => !!provide) as (P[number] &
			object)[]
		return provideValues.reduce((pre, cur) => {
			const value = isRef(cur[key]) ? (cur[key].value as V) : (cur[key] as V)
			if (mergeType === 'nullish') {
				return pre ?? value
			} else if (mergeType === 'or') {
				return pre || value
			} else {
				return mergeType(pre, value, cur)
			}
		}, undefined as V)
	})
}

export function forwardEmits<E = EmitsOptions>(
	emit: (event: any, ...args: any[]) => void,
	events: E
) {
	const eventKeys = isArray(events) ? events : isObjectLike(events) ? Object.keys(events) : []
	return eventKeys.reduce(
		(acc, key) => {
			acc[`on${key.charAt(0).toUpperCase() + key.slice(1)}`] = (...args: any[]) => {
				emit(key, ...args)
			}
			return acc
		},
		{} as Record<string, (...args: any[]) => void>
	)
}
