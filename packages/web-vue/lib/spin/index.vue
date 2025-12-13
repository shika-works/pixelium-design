<template>
	<div
		class="pixelium px-spin"
		:class="{
			[`px-spin__${props.size}`]: isString(props.size)
		}"
		:style="{
			minWidth: sizeValue,
			minHeight: sizeValue
		}"
	>
		<slot></slot>
		<div
			class="px-spin-cover"
			v-if="loadingComputed"
			:style="{
				zIndex: props.zIndex
			}"
		>
			<Mask
				:z-index="0"
				:color="props.maskColor"
				:step="props.maskStep"
				:line-width="props.maskLineWidth"
				:grid="props.maskGrid"
				v-bind="props.maskProps"
				v-if="slots.default"
			></Mask>
			<div class="px-spin-content">
				<div
					class="px-spin-icon-wrapper"
					:class="{
						'px-spin-icon-wrapper__last': !slots.description,
						[`px-spin-icon-wrapper__${props.size}`]: isString(props.size)
					}"
					:style="{
						fontSize: sizeValue
					}"
				>
					<slot name="icon">
						<SpinnerThirdSolid
							class="px-spin-icon px-animation__loading"
							:style="{
								width: sizeValue,
								height: sizeValue
							}"
						></SpinnerThirdSolid>
					</slot>
				</div>
				<slot name="description"></slot>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { COVER_Z_INDEX } from '../share/const'
import Mask from '../mask/index.vue'
import type { SpinProps } from './type'
import { computed, useSlots } from 'vue'
import SpinnerThirdSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/spinner-third-solid.svg'
import { isNumber, isString } from 'parsnip-kit'

defineOptions({
	name: 'Spin'
})

const props = withDefaults(defineProps<SpinProps>(), {
	loading: undefined,
	maskStep: 1,
	maskLineWidth: 2,
	maskGrid: true,
	zIndex: COVER_Z_INDEX,
	size: 'medium'
})

const slots = useSlots()

const sizeValue = computed(() => {
	return isNumber(props.size) ? `${props.size}px` : undefined
})

const loadingComputed = computed(() => {
	return slots.default ? !!props.loading : props.loading !== false
})
</script>

<style lang="less" src="./index.less"></style>
