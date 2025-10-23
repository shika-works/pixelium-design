<script setup lang="tsx">
import { isString } from 'parsnip-kit'
import {
	ref,
	onMounted,
	computed,
	nextTick,
	watch,
	defineProps,
	shallowRef,
	Fragment,
	getCurrentInstance,
	withScopeId
} from 'vue'
import type { VirtualListProps } from './type'
import { inVitest } from '../share/util/env'
import { useResizeObserver } from '../share/hook/use-resize-observer'

defineOptions({
	name: 'VirtualList'
})

interface Chunk {
	startIndex: number
	endIndex: number
	localPrefix: Float64Array
	totalHeight: number
}

const props = withDefaults(defineProps<VirtualListProps>(), {
	list: () => [],
	fixedHeight: false,
	estimatedHeight: 20,
	buffer: 10
})

const containerRef = shallowRef<HTMLDivElement | null>(null)
const scrollAreaRef = shallowRef<HTMLDivElement | null>(null)
const contentRef = shallowRef<HTMLDivElement | null>(null)

const scrollTop = ref(0)
const totalHeight = ref(0)

const chunks = ref<Chunk[]>([])
const blockPrefixHeights = ref<number[]>([])
const itemSizes = ref<number[]>([])

const MIN_CHUNK_SIZE = 1000

const maxListLength = ref(props.list.length)

const initChunks = () => {
	const newChunks: Chunk[] = []
	const totalCount = props.list.length
	const chunkSize = Math.max(MIN_CHUNK_SIZE, Math.ceil(Math.sqrt(totalCount)))
	for (let i = 0; i < totalCount; i += chunkSize) {
		const start = i
		const end = Math.min(i + chunkSize - 1, totalCount - 1)
		const localPrefix = new Float64Array(end - start + 1)
		let sum = 0
		for (let j = start; j <= end; j++) {
			sum += props.estimatedHeight
			localPrefix[j - start] = sum
		}
		newChunks.push({
			startIndex: start,
			endIndex: end,
			localPrefix,
			totalHeight: sum
		})
	}

	chunks.value = newChunks
	updateBlockPrefixHeights()
}

const updateChunks = (currentLength: number) => {
	if (currentLength <= maxListLength.value) {
		return
	}
	let resLength = currentLength - maxListLength.value
	maxListLength.value = currentLength
	const chunkSize = Math.max(MIN_CHUNK_SIZE, Math.ceil(Math.sqrt(currentLength)))
	const chunk = chunks.value[chunks.value.length - 1]
	const currentLen = chunk.endIndex - chunk.startIndex + 1

	if (currentLen < chunkSize) {
		let sum = chunk.totalHeight
		const nextLen = currentLen + resLength >= chunkSize ? chunkSize : currentLen + resLength
		chunk.endIndex = chunk.startIndex + nextLen - 1
		const preLocalPrefix = chunk.localPrefix
		chunk.localPrefix = new Float64Array(chunkSize)
		chunk.localPrefix.set(preLocalPrefix, 0)
		for (let i = preLocalPrefix.length; i < chunk.localPrefix.length; i++) {
			sum += props.estimatedHeight
			chunk.localPrefix[i] = sum
		}
		chunk.totalHeight = sum
		resLength = Math.max(0, resLength - chunkSize + currentLen)
	}
	while (resLength > 0) {
		const start = Math.min(
			chunks.value[chunks.value.length - 1].endIndex + 1,
			currentLength - 1
		)
		const end = Math.min(start + chunkSize - 1, currentLength - 1)

		const localPrefix = new Float64Array(end - start + 1)
		let sum = 0
		for (let j = start; j <= end; j++) {
			sum += props.estimatedHeight
			localPrefix[j - start] = sum
		}
		chunks.value.push({
			startIndex: start,
			endIndex: end,
			localPrefix,
			totalHeight: sum
		})
		resLength -= end - start + 1
	}
	updateBlockPrefixHeights()
}

const updateBlockPrefixHeights = () => {
	const prefix: number[] = []
	let sum = 0
	for (const chunk of chunks.value) {
		sum += chunk.totalHeight
		prefix.push(sum)
	}
	blockPrefixHeights.value = prefix
	totalHeight.value = prefix.at(-1) || 0
}

const findChunkByIndex = (index: number): Chunk | null => {
	if (chunks.value.length === 0) return null
	let left = 0
	let right = chunks.value.length - 1
	while (left <= right) {
		const mid = Math.floor((left + right) / 2)
		const chunk = chunks.value[mid]
		if (index >= chunk.startIndex && index <= chunk.endIndex) {
			return chunk
		} else if (index < chunk.startIndex) {
			right = mid - 1
		} else {
			left = mid + 1
		}
	}
	return null
}

const getItemHeight = (index: number): number => {
	if (props.fixedHeight) return props.estimatedHeight
	return itemSizes.value[index] ?? props.estimatedHeight
}

const getAccumulatedHeight = (index: number): number => {
	if (index < 0) return 0
	const chunk = findChunkByIndex(index)
	if (!chunk) return 0

	const prevChunksHeight =
		chunk.startIndex === 0 ? 0 : blockPrefixHeights.value[chunks.value.indexOf(chunk) - 1] || 0

	const withinChunkIndex = index - chunk.startIndex
	const withinChunkHeight = chunk.localPrefix[withinChunkIndex]

	return prevChunksHeight + withinChunkHeight
}

const findNearestItemIndex = (scrollPosition: number): number => {
	if (props.fixedHeight) {
		return Math.floor(scrollPosition / props.estimatedHeight)
	}

	if (chunks.value.length === 0) return 0

	let chunkIndex = blockPrefixHeights.value.length - 1
	let left = 0
	let right = blockPrefixHeights.value.length - 1
	while (left <= right) {
		const mid = Math.floor((left + right) / 2)
		if (blockPrefixHeights.value[mid] > scrollPosition) {
			chunkIndex = mid
			right = mid - 1
		} else {
			left = mid + 1
		}
	}

	const targetChunk = chunks.value[chunkIndex]
	const prevChunksHeight = chunkIndex === 0 ? 0 : blockPrefixHeights.value[chunkIndex - 1] || 0
	const scrollInChunk = scrollPosition - prevChunksHeight

	left = 0
	right = targetChunk.localPrefix.length - 1
	let resInChunk = 0
	while (left <= right) {
		const mid = Math.floor((left + right) / 2)
		if (targetChunk.localPrefix[mid] > scrollInChunk) {
			resInChunk = mid
			right = mid - 1
		} else {
			left = mid + 1
		}
	}

	return targetChunk.startIndex + resInChunk
}

const calcVisibleRange = () => {
	if (!containerRef.value) return { start: 0, end: 0 }
	const containerHeight = containerRef.value.clientHeight
	const start = findNearestItemIndex(scrollTop.value)

	let end = start
	let accumulatedHeight = 0
	let endPoint = props.list.length
	let overFlag = false

	while (end < endPoint) {
		const itemHeight = getItemHeight(end)
		accumulatedHeight += itemHeight

		if (accumulatedHeight > containerHeight && !overFlag) {
			endPoint = end + props.buffer + 1
			overFlag = true
		}
		end++
	}

	end = Math.min(end, props.list.length)
	return {
		start: Math.max(0, start - props.buffer),
		end
	}
}
const visibleRange = ref(calcVisibleRange())

watch(
	[
		scrollTop,
		() => props.buffer,
		() => props.list.length,
		() => props.fixedHeight,
		blockPrefixHeights
	],
	() => {
		visibleRange.value = calcVisibleRange()
	}
)

const contentOffset = computed(() => {
	const { start } = visibleRange.value
	return getAccumulatedHeight(start - 1)
})

const updateItemSizes = () => {
	if (!contentRef.value) return
	if (props.fixedHeight) {
		return
	}

	const items = contentRef.value.children
	const { start } = visibleRange.value
	let hasChange = false

	for (let i = 0; i < items.length; i++) {
		const itemIndex = start + i
		if (itemIndex >= props.list.length) break

		const itemHeight = inVitest() ? 40 : (items[i] as HTMLElement).offsetHeight

		const oldHeight = itemSizes.value[itemIndex]
		if (oldHeight !== itemHeight) {
			itemSizes.value[itemIndex] = itemHeight
			hasChange = true
		}
	}

	if (hasChange) {
		const { start: visibleStart, end: visibleEnd } = visibleRange.value
		const startChunk = findChunkByIndex(visibleStart)
		const endChunk = findChunkByIndex(visibleEnd)
		if (!startChunk || !endChunk) return

		const startChunkIdx = chunks.value.indexOf(startChunk)
		const endChunkIdx = chunks.value.indexOf(endChunk)

		for (let cIdx = startChunkIdx; cIdx <= endChunkIdx; cIdx++) {
			const chunk = chunks.value[cIdx]
			let sum = 0
			for (let i = chunk.startIndex; i <= chunk.endIndex; i++) {
				sum += getItemHeight(i)
				chunk.localPrefix[i - chunk.startIndex] = sum
			}
			chunk.totalHeight = sum
		}
		updateBlockPrefixHeights()
		visibleRange.value = calcVisibleRange()
	}
}

const handleScroll = (e: Event) => {
	scrollTop.value = (e.target as HTMLElement).scrollTop
}

onMounted(() => {
	initChunks()
	nextTick(() => {
		updateItemSizes()
	})
})

const watchFn = () => {
	updateChunks(props.list.length)
	nextTick(() => {
		updateItemSizes()
	})
}

watch(() => props.list.length, watchFn)

watch(
	visibleRange,
	() => {
		nextTick(() => {
			updateItemSizes()
		})
	},
	{ deep: true }
)

useResizeObserver(containerRef, () => {
	nextTick(() => {
		visibleRange.value = calcVisibleRange()
	})
})

const instance = getCurrentInstance()

defineRender(() => {
	const { start, end } = visibleRange.value
	const visibleItems = props.list.slice(start, end + 1)

	const scopeId = instance?.vnode.scopeId

	const placeholderHeight = totalHeight.value || props.list.length * props.estimatedHeight

	const render = () => (
		<div ref={containerRef} class={'px-virtual-list'}>
			<div ref={scrollAreaRef} class={'px-virtual-list-scroll-area'} onScroll={handleScroll}>
				<div
					class={props.fixedHeight && 'px-virtual-list-content'}
					style={{
						maxHeight: props.fixedHeight ? `${placeholderHeight}px` : undefined
					}}
				>
					<div
						class={'px-virtual-list-placeholder'}
						style={{
							height: `${placeholderHeight}px`
						}}
					/>
					<div
						ref={contentRef}
						class={'px-virtual-list-item'}
						style={{
							transform: `translateY(${contentOffset.value}px)`
						}}
					>
						{visibleItems.map((item, index) => {
							const itemIndex = start + index
							const key = item.key ?? itemIndex

							const renderResult = item.render
							let content
							if (isString(renderResult)) {
								content = <div>{renderResult}</div>
							} else {
								const renderReturn = renderResult()
								if (isString(renderReturn)) {
									content = <div>{renderReturn}</div>
								} else {
									content = renderReturn
								}
							}

							return <Fragment key={key}>{content}</Fragment>
						})}
					</div>
				</div>
			</div>
		</div>
	)

	return scopeId ? withScopeId(scopeId)(render)() : render()
})
</script>
<style lang="less" src="./index.less" />
