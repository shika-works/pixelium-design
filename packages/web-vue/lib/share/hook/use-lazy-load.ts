import { isArray, isNullish, isString, mergeSkipNullish } from 'parsnip-kit'
import { nextTick, onMounted, onUnmounted, type Ref } from 'vue'
import { logWarn } from '../util/console'
import { checkIntersection } from '../util/dom'

type LazyLoadOptions = {
	onLoad?: (img: HTMLImageElement, event: Event) => void
	onError?: (img: HTMLImageElement, error: string | Event) => void
	onLoading?: (img: HTMLImageElement) => void
	rootMargin?: number | [number, number]
	root?: HTMLElement | string
}

const observedElementMap = new WeakMap<
	HTMLElement | typeof VIEWPORT_FAKE_ELEMENT,
	Map<string, Set<HTMLImageElement>>
>()
const VIEWPORT_FAKE_ELEMENT = {}
const observerMap = new WeakMap<
	HTMLElement | typeof VIEWPORT_FAKE_ELEMENT,
	Map<string, IntersectionObserver>
>()

const imgOptionsMap = new WeakMap<HTMLImageElement, LazyLoadOptions>()

export function useLazyLoad(
	imgRef: Ref<HTMLImageElement | null>,
	options: LazyLoadOptions = {}
) {
	const curOptions: LazyLoadOptions = mergeSkipNullish(options, {
		lazyOffset: 0
	})

	let curRoot: HTMLElement | undefined = undefined

	const loadImageImpl = (
		img: HTMLImageElement,
		imgOptions: LazyLoadOptions,
		src?: string,
		srcset?: string
	) => {
		imgOptions.onLoading?.(img)
		const tempImg = new Image()
		tempImg.src = src || ''
		tempImg.referrerPolicy = img.referrerPolicy
		tempImg.crossOrigin = img.crossOrigin
		tempImg.srcset = srcset || ''

		tempImg.onload = (e: Event) => {
			imgOptions.onLoad?.(img, e)
		}

		tempImg.onerror = (error) => {
			imgOptions.onError?.(img, error)
		}
	}

	const loadImage = (img: HTMLImageElement) => {
		const src = img.dataset.src
		const srcset = img.dataset.srcset

		if (!src && !srcset) return
		const imgOptions = imgOptionsMap.get(img)!
		loadImageImpl(img, imgOptions, src, srcset)
	}

	const key = isArray(curOptions.rootMargin)
		? `${curOptions.rootMargin[0]}-${curOptions.rootMargin[1]}`
		: String(curOptions.rootMargin)

	const getObserver = () => {
		const keyEl = curRoot || VIEWPORT_FAKE_ELEMENT
		let observers = observerMap.get(keyEl)
		if (!observers) {
			observerMap.set(keyEl, new Map())
			observers = observerMap.get(keyEl)!
		}
		const observer = observers!.get(key)
		return {
			observers,
			observer
		}
	}

	const getObservedElements = (key: string) => {
		const keyEl = curRoot || VIEWPORT_FAKE_ELEMENT
		let observedSetMap = observedElementMap.get(keyEl)
		if (!observedSetMap) {
			observedElementMap.set(keyEl, new Map())
			observedSetMap = observedElementMap.get(keyEl)!
		}
		let observedSet = observedSetMap.get(key)
		if (!observedSet) {
			observedSetMap.set(key, new Set())
			observedSet = observedSetMap.get(key)!
		}
		return {
			observedSet,
			observedSetMap
		}
	}

	const initObserver = () => {
		const { observer, observers } = getObserver()
		if (observer) return
		const rootMargin = !isNullish(curOptions.rootMargin)
			? isArray(curOptions.rootMargin)
				? `${curOptions.rootMargin[1]}px ${curOptions.rootMargin[0]}px`
				: `${curOptions.rootMargin}px`
			: undefined

		const curObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const img = entry.target as HTMLImageElement

						loadImage(img)
						unobserve(img)
					}
				})
			},
			{
				root: curRoot,
				rootMargin
			}
		)
		observers.set(key, curObserver)
	}

	const observe = (img: HTMLImageElement) => {
		const { observedSet } = getObservedElements(key)
		if (observedSet.has(img) || img.dataset.loaded === 'true') return
		const { observers } = getObserver()

		observers.get(key)!.observe(img)
		observedSet.add(img)
		imgOptionsMap.set(img, curOptions)
	}

	const unobserve = (img: HTMLImageElement) => {
		const { observedSet, observedSetMap } = getObservedElements(key)
		const { observers } = getObserver()
		observers.get(key)!.unobserve(img)
		observedSet.delete(img)
		imgOptionsMap.delete(img)

		if (observedSet.size === 0) {
			observers.get(key)!.disconnect()
			observers.delete(key)
			observedSetMap.delete(key)
		}
	}

	const scanImages = () => {
		if (!imgRef.value) return
		observe(imgRef.value)
	}

	const init = () => {
		nextTick(() => {
			if (!imgRef.value) {
				return
			}
			if (isString(curOptions.root)) {
				const dom = document.querySelector(curOptions.root)
				if (dom instanceof HTMLElement) {
					curRoot = dom
				} else {
					logWarn(
						`The DOM node for the visible area of lazy loading was not found, and the viewport is used as the visible area by default.`,
						true
					)
				}
			} else {
				curRoot = curOptions.root
			}
			initObserver()
			const intersection = checkIntersection(imgRef.value, curRoot)
			const marginX = isArray(curOptions.rootMargin)
				? curOptions.rootMargin[0]
				: curOptions.rootMargin || 0
			const marginY = isArray(curOptions.rootMargin)
				? curOptions.rootMargin[1]
				: curOptions.rootMargin || 0

			if (
				intersection.hasIntersection ||
				(intersection.x < marginX && intersection.y < marginY)
			) {
				const src = imgRef.value.dataset.src
				const srcset = imgRef.value.dataset.srcset
				if (src || srcset) {
					loadImageImpl(imgRef.value, curOptions, src, srcset)
				}
			} else {
				scanImages()
			}
		})
	}

	const destroy = () => {
		if (imgRef.value) {
			unobserve(imgRef.value)
		}
	}

	onMounted(init)

	onUnmounted(destroy)
}
