<template>
	<a
		class="pixelium px-link"
		:class="{
			'px-link__loading': props.loading,
			'px-link__disabled': props.disabled,
			'px-link__custom': palette,
			[`px-link__${props.theme || 'primary'}`]: true
		}"
		:style="{
			color: textColor
		}"
		@mouseenter="toggleHover(true)"
		@mouseleave="toggleHover(false)"
		@mousedown="toggleActive(true)"
		@mouseup="toggleActive(false)"
		:href="props.href"
		:target="props.target"
		@click="clickHandler"
	>
		<div
			v-if="slots.icon || props.loading"
			class="px-link-icon-wrapper"
			:class="{
				'px-link-icon-wrapper__last': !slots.default
			}"
		>
			<SpinnerThirdSolid
				v-if="props.loading"
				class="px-link-icon px-animation__loading"
				:style="{
					fill: textColor
				}"
			></SpinnerThirdSolid>
			<slot name="icon" v-else> </slot>
		</div>
		<slot></slot>
	</a>
</template>
<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import type { LinkProps } from './type'
import { generatePalette, parseColor, rgbaColor2string } from '../share/util/color'
import type { RgbaColor } from '../share/type'
import SpinnerThirdSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/spinner-third-solid.svg'
import { useDarkMode } from '../share/hook/use-dark-mode'

defineOptions({
	name: 'Link'
})

const props = defineProps<LinkProps>()
const slots = useSlots()

const darkMode = useDarkMode()

const palette = computed<null | RgbaColor[]>(() => {
	if (!props.color) return null
	const color = parseColor(props.color)
	const palette = generatePalette(color.r, color.g, color.b, color.a, darkMode.value)
	return palette
})

const hoverFlag = ref(false)
const activeFlag = ref(false)

const toggleHover = (value: boolean) => {
	hoverFlag.value = value
}

const toggleActive = (value: boolean) => {
	activeFlag.value = value
}

const getTextColorWithPalette = (
	palette: RgbaColor[] | null,
	disabled: boolean,
	loading: boolean,
	hoverFlag: boolean,
	activeFlag: boolean
) => {
	if (!palette) return undefined

	if (disabled) {
		return rgbaColor2string(palette[1])
	}
	if (loading) return rgbaColor2string(palette[5])
	if (activeFlag) return rgbaColor2string(palette[6])
	if (hoverFlag) return rgbaColor2string(palette[4])

	return rgbaColor2string(palette[5])
}

const textColor = computed(() => {
	return getTextColorWithPalette(
		palette.value,
		props.disabled,
		props.loading,
		hoverFlag.value,
		activeFlag.value
	)
})

const clickHandler = (e: MouseEvent) => {
	if (props.disabled || props.loading) {
		e.preventDefault()
	}
}
</script>

<style lang="less" src="./index.less"></style>
