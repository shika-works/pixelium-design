import {
	computed,
	nextTick,
	onBeforeUnmount,
	ref,
	watch,
	type ComputedRef,
	type Ref,
	type ShallowRef
} from 'vue'
import { useResizeObserver } from './use-resize-observer'

type ExpandStatus = 'collapsed' | 'expanding' | 'expanded' | 'collapsing'

type ExpandDuration = number | (() => number)

export type ExpandCollapsedHeight = number | 'content'

const reflow = (element: HTMLElement) => element.offsetHeight

export const useExpandTransition = (
	wrapperRef: ShallowRef<HTMLElement | null>,
	contentRef: Ref<HTMLElement | null | undefined> | undefined,
	expandedRef: Ref<boolean | undefined> | ComputedRef<boolean | undefined>,
	duration: ExpandDuration,
	collapsedHeight: ExpandCollapsedHeight = 0
) => {
	let timer: any
	let target: number | null = null
	const status = ref<ExpandStatus>(expandedRef.value ? 'expanded' : 'collapsed')
	const showContent = computed(() => status.value !== 'collapsed')

	const getDuration = () => (typeof duration === 'function' ? duration() : duration)

	const clearTimer = () => {
		if (timer) {
			clearTimeout(timer)
			timer = undefined
		}
	}

	const naturalHeight = () => {
		const node = wrapperRef.value
		if (!node) {
			return 0
		}
		const content = contentRef?.value
		if (content) {
			return content.offsetHeight
		}
		const height = node.style.height
		const transition = node.style.transition
		node.style.transition = 'none'
		node.style.height = ''
		const value = node.offsetHeight
		node.style.height = height
		node.style.transition = transition
		return value
	}

	const settledHeight = () => {
		if (collapsedHeight === 'content') {
			return null
		}
		if (!expandedRef.value) {
			return collapsedHeight
		}
		return contentRef?.value ? naturalHeight() : null
	}

	const animatedHeight = () => {
		if (collapsedHeight !== 'content' && !expandedRef.value) {
			return collapsedHeight
		}
		const measured = naturalHeight()
		return measured > 0 ? measured : null
	}

	const writeHeight = (node: HTMLElement, height: number | null) => {
		if (height === null) {
			node.style.height = ''
			node.style.overflow = ''
			return
		}
		node.style.height = `${height}px`
		node.style.overflow = 'hidden'
	}

	const declaredTransitions = (node: HTMLElement) => {
		node.style.transition = ''
		const computed = getComputedStyle(node)
		const properties = computed.transitionProperty.split(',').map((entry) => entry.trim())
		const durations = computed.transitionDuration.split(',')
		const preserved = properties.some(
			(property, index) => property !== 'all' && parseFloat(durations[index]) > 0
		)
		return preserved && !properties.includes('all') ? computed.transition.trim() : ''
	}

	const transitionOf = (declared: string, delay: number) =>
		declared ? `${declared}, height ${delay}ms` : `height ${delay}ms`

	const settle = (node: HTMLElement | null, height: number | null = settledHeight()) => {
		clearTimer()
		status.value = expandedRef.value ? 'expanded' : 'collapsed'
		if (!node) {
			return
		}
		node.style.transition = ''
		writeHeight(node, height)
	}

	const animate = (node: HTMLElement, from: number, to: number | null) => {
		target = to
		clearTimer()
		const declared = declaredTransitions(node)
		node.style.transition = 'none'
		writeHeight(node, from)
		reflow(node)
		const delay = getDuration()
		if (to === null || !delay) {
			settle(node)
			return
		}
		node.style.transition = transitionOf(declared, delay)
		writeHeight(node, to)
		timer = setTimeout(() => settle(node), delay)
	}

	const retarget = () => {
		const node = wrapperRef.value
		if (!node || !contentRef?.value) {
			return
		}
		const to = animatedHeight()
		if (to === null || to === target) {
			return
		}
		animate(node, node.offsetHeight, to)
	}

	watch(expandedRef, async () => {
		status.value = expandedRef.value ? 'expanding' : 'collapsing'
		clearTimer()
		const from = wrapperRef.value?.offsetHeight ?? 0
		await nextTick()
		const node = wrapperRef.value
		if (!node) {
			settle(null)
			return
		}
		animate(node, from, animatedHeight())
	})

	watch(
		wrapperRef,
		(node) => {
			if (!node || status.value === 'expanding' || status.value === 'collapsing') {
				return
			}
			settle(node)
		},
		{ flush: 'post' }
	)

	if (contentRef) {
		useResizeObserver(contentRef, retarget)
	}

	onBeforeUnmount(clearTimer)

	return [showContent] as const
}
