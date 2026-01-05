import { useOverlayScrollbars } from 'overlayscrollbars-vue'
import { ref } from 'vue'
import { initScroll } from '../share/util/scroll'

export const useScrollBar = () => {
	initScroll()
	const initialized = ref(false)
	const [init, getInstance] = useOverlayScrollbars({
		defer: true,
		events: {
			initialized: () => {
				initialized.value = true
			},
			destroyed: () => {
				initialized.value = false
			}
		},
		options: {
			scrollbars: {
				theme: 'px-scroll-theme',
				clickScroll: true
			}
		}
	})
	return [init, getInstance, initialized] as const
}
