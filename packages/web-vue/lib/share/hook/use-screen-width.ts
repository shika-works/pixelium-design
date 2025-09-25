import { computed, onBeforeUnmount, ref } from 'vue'
import { SCREEN_SIZE_TYPE } from '../const'
import { inBrowser } from '../util/env'

export const useScreenWidth = () => {
	const screenWidth = ref(0)
	function handleResize() {
		if (!inBrowser()) return
		screenWidth.value = window.innerWidth
	}
	handleResize()
	const screenSizeType = computed(() => {
		let type
		if (screenWidth.value <= 576) {
			type = SCREEN_SIZE_TYPE.XS
		} else if (screenWidth.value <= 768) {
			type = SCREEN_SIZE_TYPE.SM
		} else if (screenWidth.value <= 992) {
			type = SCREEN_SIZE_TYPE.MD
		} else if (screenWidth.value <= 1200) {
			type = SCREEN_SIZE_TYPE.LG
		} else if (screenWidth.value <= 1600) {
			type = SCREEN_SIZE_TYPE.XL
		} else {
			type = SCREEN_SIZE_TYPE.XXL
		}
		return type
	})

	if (inBrowser()) {
		window.addEventListener('resize', handleResize)
		onBeforeUnmount(() => {
			window.removeEventListener('resize', handleResize)
		})
	}
	return [screenSizeType, screenWidth] as const
}
