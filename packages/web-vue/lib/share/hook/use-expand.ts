import {
	computed,
	onUpdated,
	ref,
	watch,
	type ComputedRef,
	type Ref,
	type ShallowRef
} from 'vue'

type ExpandStatus = 'collapsed' | 'expanding' | 'expanded' | 'collapsing'

export const useExpand = (
	wrapperRef: ShallowRef<HTMLElement | null>,
	expandedRef: Ref<boolean | undefined> | ComputedRef<boolean | undefined>,
	foldDelay: number
) => {
	let timer4Fold: any
	let timer4Expand: any
	const listHeight = ref(0)
	const expandStatus = ref<ExpandStatus>(expandedRef.value ? 'expanded' : 'collapsed')
	const showContent = computed(() => {
		return expandStatus.value !== 'collapsed'
	})
	const maxHeight = computed(() => {
		return expandStatus.value === 'expanded' ? 'none' : listHeight.value + 'px'
	})

	watch(expandedRef, (val) => {
		if (timer4Fold) {
			clearTimeout(timer4Fold)
			timer4Fold = undefined
		}
		if (timer4Expand) {
			clearTimeout(timer4Expand)
			timer4Expand = undefined
		}
		if (val) {
			expandStatus.value = 'expanding'
			setTimeout(() => {
				if (wrapperRef.value) {
					listHeight.value = wrapperRef.value.scrollHeight
				}
				timer4Expand = setTimeout(() => {
					expandStatus.value = 'expanded'
				}, foldDelay)
			})
		} else {
			expandStatus.value = 'collapsing'
			if (wrapperRef.value) {
				listHeight.value = wrapperRef.value.scrollHeight
			}
			requestAnimationFrame(() => {
				listHeight.value = 0
				timer4Fold = setTimeout(() => {
					expandStatus.value = 'collapsed'
				}, foldDelay)
			})
		}
	})

	onUpdated(() => {
		setTimeout(() => {
			if (expandedRef.value && wrapperRef.value) {
				listHeight.value = wrapperRef.value.scrollHeight
			}
		})
	})

	return [showContent, maxHeight] as const
}
