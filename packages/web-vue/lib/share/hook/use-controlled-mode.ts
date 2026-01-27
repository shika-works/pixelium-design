import type { Nullish } from 'parsnip-kit'
import { computed, nextTick, ref, watch, type Ref } from 'vue'

export const useControlledMode = <
	T extends any,
	K extends string = string,
	D extends string | undefined = undefined,
	P extends { [key in (K | D) & string]: T | Nullish } = {
		[key in (K | D) & string]: T | Nullish
	},
	const V extends P[K] = P[K]
>(
	field: K,
	props: P,
	emits: Function,
	options?: {
		transform?: (nextValue: T | Nullish) => T | Nullish
		initial?: (nextValue: T | Nullish) => T | Nullish
		defaultField?: D
	}
) => {
	const controlledMode = computed(() => props[field] !== undefined)

	let preValue = (
		controlledMode.value
			? props[field]
			: options?.defaultField
				? props[options.defaultField]
				: null
	) as V | Nullish
	if (options?.initial) {
		preValue = options.initial(preValue) as V | Nullish
	}
	if (options?.transform) {
		preValue = options.transform(preValue) as V | Nullish
	}

	const innerState = ref(preValue) as Ref<V | Nullish>
	const updateState = async (nextValue: V) => {
		if (controlledMode.value) {
			emits(`update:${field}`, nextValue)
			await nextTick()
			innerState.value = options?.transform
				? (options?.transform(props[field]) as V | Nullish)
				: (props[field] as V | Nullish)
		} else {
			innerState.value = options?.transform
				? (options?.transform(nextValue) as V | Nullish)
				: (nextValue as V | Nullish)
		}
	}
	watch(
		() => props[field],
		(val: any) => {
			innerState.value = options?.transform ? options?.transform(val) : val
		}
	)

	return [innerState, updateState, controlledMode] as const
}
