import { readonly, ref } from 'vue'

export function useHover() {
	const isHover = ref(false)

	const mouseenterHandler = () => {
		isHover.value = true
	}

	const mouseleaveHandler = () => {
		isHover.value = false
	}

	return [readonly(isHover), mouseenterHandler, mouseleaveHandler] as const
}
