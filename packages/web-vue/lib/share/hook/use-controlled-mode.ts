import type { Nullish } from 'parsnip-kit'
import { computed, nextTick, ref, watch, type Ref } from 'vue'

export const useControlledMode = <T>(
	field: string,
	props: Record<string, any>,
	emits: Function,
	options?: {
		transform?: (nextValue: T | Nullish) => T | Nullish
		defaultField?: string
	}
) => {
	const controlledMode = computed(() => props[field] !== undefined)

	const preValue = (
		controlledMode.value
			? props[field]
			: options?.defaultField
				? props[options.defaultField]
				: null
	) as T | Nullish

	const innerState = ref(options?.transform ? options?.transform(preValue) : preValue) as Ref<
		T | Nullish
	>
	const updateState = async (nextValue: T) => {
		if (controlledMode.value) {
			emits(`update:${field}`, nextValue)
			await nextTick()
			innerState.value = options?.transform ? options?.transform(props[field]) : props[field]
		} else {
			innerState.value = options?.transform ? options?.transform(nextValue) : nextValue
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
