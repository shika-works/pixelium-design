import { ref, type ShallowRef } from 'vue'
import { useCancelableDelay } from './use-cancelable-delay'

export interface UseFocusModeOptions {
	delay?: number
	onFocus?: (event: FocusEvent, isFirstFocus: boolean) => void
	onBlur?: (event: FocusEvent) => void
	onPopupMousedown?: (event: MouseEvent, isFirstFocus: boolean) => void | boolean
	onWrapperMousedown?: (event: MouseEvent, isFirstFocus: boolean) => void | boolean
}

export const useFocusMode = (
	options: UseFocusModeOptions = {},
	elementRef?: ShallowRef<HTMLElement | null>
) => {
	const [wait, cancel] = useCancelableDelay(options.delay)
	const focusMode = ref(false)

	const focusHandler = (event: FocusEvent) => {
		cancel()

		const currentFocusMode = focusMode.value
		focusMode.value = true

		options.onFocus?.(event, !currentFocusMode)
	}

	const blurHandler = async (event: FocusEvent) => {
		const next = await wait()
		if (!next) {
			return
		}

		if (!focusMode.value) {
			return
		}

		focusMode.value = false
		options.onBlur?.(event)
	}

	const focusElement = () => {
		setTimeout(() => {
			cancel()
			if (elementRef?.value && typeof elementRef.value.focus === 'function') {
				elementRef.value.focus()
			}
		}, 0)
	}

	const popupMousedownHandler = (event: MouseEvent) => {
		const currentFocusMode = focusMode.value
		const shouldFocus = options.onPopupMousedown?.(event, !currentFocusMode)
		if (shouldFocus !== false) {
			focusElement()
		}
	}

	const wrapperMousedownHandler = (event: MouseEvent) => {
		const currentFocusMode = focusMode.value
		const shouldFocus = options.onWrapperMousedown?.(event, !currentFocusMode)
		if (shouldFocus !== false) {
			focusElement()
		}
	}

	return {
		focusMode,
		focusHandler,
		blurHandler,
		cancel,
		focusElement,
		popupMousedownHandler,
		wrapperMousedownHandler
	}
}
