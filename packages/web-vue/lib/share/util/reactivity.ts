import type { Nullish } from 'parsnip-kit'
import { computed, isRef, type Ref, type UnwrapRef } from 'vue'

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
	provides: P,
	mergeType: 'nullish' | 'or' | ((pre: V, value: V, cur: P[number] & object) => any) = 'nullish'
) => {
	return computed(() => {
		const provideValues = provides.filter((provide: P[number]) => !!provide) as (P[number] &
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
