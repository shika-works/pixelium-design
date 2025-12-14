<template>
	<div
		class="pixelium px-image"
		:class="{
			[`px-image__${props.objectFit}`]: !!props.objectFit,
			'px-image-previewable': loaded && props.previewable
		}"
		@click="clickHandler"
	>
		<img
			:src="curSrc"
			:srcset="curSrcset"
			:alt="props.alt"
			:data-src="props.lazy ? props.src : undefined"
			:data-srcset="props.lazy ? props.srcset : undefined"
			:data-loaded="props.lazy ? loaded : undefined"
			:data-error="props.lazy ? loadFailed : undefined"
			:loading="props.lazy ? undefined : props.loading"
			:referrerpolicy="props.referrerpolicy as any"
			:crossorigin="props.crossorigin"
			:style="{
				visibility: loadFailed || (!curSrc && !curSrcset) ? 'hidden' : undefined
			}"
			class="px-image-img"
			ref="imgRef"
			@load="loadHandler"
			@error="errorHandler"
		/>
		<div class="px-image-fallback" v-if="slots.placeholder || slots.error">
			<slot v-if="!loaded && !loadFailed" name="placeholder"></slot>
			<slot v-if="loadFailed" name="error"></slot>
		</div>
		<PopupWrapper
			v-if="props.previewable"
			:visible="previewVisible"
			:position="'fixed'"
			:close-delay="ANIMATION_DURATION"
			v-bind="props.popupWrapperProps"
		>
			<Transition name="px-image-preview">
				<div class="px-image-preview" v-if="previewVisible">
					<Mask :z-index="0" v-bind="maskProps" @click="closeHandler"></Mask>
					<Times z-index="0" @click="closeHandler" class="px-image-preview-close"></Times>
					<img
						z-index="0"
						:src="curSrc"
						:srcset="curSrcset"
						:alt="props.alt"
						:referrerpolicy="props.referrerpolicy as any"
						:crossorigin="props.crossorigin"
						class="px-image-preview-img"
						:style="{
							width: `${previewStyle.width}px`,
							height: `${previewStyle.height}px`,
							transform: `translate(${previewStyle.left}px, ${previewStyle.top}px)`
						}"
					/>
				</div>
			</Transition>
		</PopupWrapper>
	</div>
</template>
<script lang="ts" setup>
import { ref, shallowRef, useSlots, watch } from 'vue'
import type { ImageEvents, ImageProps } from './type'
import { useLazyLoad } from '../share/hook/use-lazy-load'
import { calculateZoomedSize } from '../share/util/dom'
import PopupWrapper from '../popup-wrapper/index.vue'
import Mask from '../mask/index.vue'
import { useWindowResizeListener } from '../share/hook/use-window-resize-listener'
// @ts-ignore
import Times from '@hackernoon/pixel-icon-library/icons/SVG/regular/times.svg'

defineOptions({
	name: 'Image'
})

const slots = useSlots()

const props = withDefaults(defineProps<ImageProps>(), {
	objectFit: 'fill',
	loading: 'eager',
	referrerpolicy: 'no-referrer',
	crossorigin: '',
	rootMargin: () => [100, 200],
	previewable: false,
	lazy: false
})

const ANIMATION_DURATION = 250

const curSrc = ref<string | undefined>(props.lazy ? undefined : props.src)
const curSrcset = ref<string | undefined>(props.lazy ? undefined : props.srcset)
const loadFailed = ref(false)
const loaded = ref(false)

const previewVisible = ref(false)

const imgRef = shallowRef<HTMLImageElement | null>(null)

const emits = defineEmits<ImageEvents>()

useLazyLoad(imgRef, {
	root: props.root,
	rootMargin: props.rootMargin,
	onError: (img, error) => {
		loadFailed.value = true
		loaded.value = false
		emits('error', img, error)
	},
	onLoading: (img) => {
		emits('loading', img)
	},
	onLoad: () => {
		curSrc.value = props.src
		curSrcset.value = props.srcset
	}
})

const loadHandler = (event: Event) => {
	if (imgRef.value) {
		loaded.value = true
		loadFailed.value = false
		emits('load', imgRef.value, event)
	}
}

const errorHandler = (error: Event) => {
	loadFailed.value = true
	loaded.value = false
	if (imgRef.value) {
		emits('error', imgRef.value, error)
	}
}

const previewStyle = ref({ width: 0, height: 0, top: 0, left: 0 })

const clickHandler = (e: MouseEvent) => {
	if (!(loaded.value && props.previewable) || !imgRef.value) {
		return
	}
	previewStyle.value = calculateZoomedSize(imgRef.value)
	previewVisible.value = true
	emits('preview', e)
}

useWindowResizeListener(() => {
	if (!(loaded.value && props.previewable) || !imgRef.value || !previewVisible.value) {
		return
	}
	previewStyle.value = calculateZoomedSize(imgRef.value, props.zoomOptions)
})

const closeHandler = (e: MouseEvent) => {
	previewVisible.value = false
	emits('close', e)
}

watch(
	() => props.src,
	(val) => {
		if (loaded.value) {
			curSrc.value = val
		} else if (!props.lazy) {
			curSrc.value = val
		}
	}
)
watch(
	() => props.srcset,
	(val) => {
		if (loaded.value) {
			curSrcset.value = val
		} else if (!props.lazy) {
			curSrcset.value = val
		}
	}
)
</script>

<style lang="less" src="./index.less"></style>
<style lang="less" src="../share/style/index.css" />
