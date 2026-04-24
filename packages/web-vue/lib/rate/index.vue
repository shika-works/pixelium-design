<template>
	<div
		class="pixelium px-rate"
		:class="{
			'px-rate__disabled': disabledComputed,
			'px-rate__readonly': readonlyComputed
		}"
		:tabindex="disabledComputed || readonlyComputed ? -1 : 0"
		ref="rateRef"
		@focusin="focusHandler"
		@focusout="blurHandler"
		@mousedown="wrapperMousedownHandler"
	>
		<div class="px-rate-inner">
			<template v-for="index in props.count" :key="index">
				<RateItem
					@mouseenter="rateItemMouseenterHandler($event, index)"
					@mouseleave="rateItemMouseleaveHandler"
					@mousemove="rateItemMousemoveHandler($event, index)"
					@click="rateItemClickHandler($event, index)"
					:disabled="disabledComputed"
					:active-color="props.activeColor"
					:active="checkActive(index)"
					:half="checkHalf(index)"
					:poll-size-change="pollSizeChangeComputed"
				/>
			</template>
		</div>
	</div>
</template>

<script setup lang="tsx">
import { inject, shallowRef, ref, watch } from 'vue'
import type { FormItemProvide } from '../form-item/type'
import { FORM_ITEM_PROVIDE } from '../share/const/provide-key'
import { createProvideComputed } from '../share/util/reactivity'
import RateItem from './rate-item.vue'
import type { RateEvents, RateProps } from './type'
import type { Nullish } from 'parsnip-kit'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import { useFocusMode } from '../share/hook/use-focus-mode'
import { nextTick } from 'vue'

defineOptions({
	name: 'Rate',
	activeColor: '#FFCC33'
})

const props = withDefaults(defineProps<RateProps>(), {
	count: 5
})

const emits = defineEmits<RateEvents>()

const rateRef = shallowRef<HTMLDivElement | null>(null)

const [modelValue, updateModelValue] = useControlledMode('modelValue', props, emits, {
	defaultField: 'defaultValue',
	transform: (e: number | Nullish) => {
		return e || 0
	}
})

const hoverValue = ref<number>(0)

const formItemProvide = inject<undefined | FormItemProvide>(FORM_ITEM_PROVIDE, undefined)

const readonlyComputed = createProvideComputed('readonly', [formItemProvide, props], 'or')
const disabledComputed = createProvideComputed('disabled', [formItemProvide, props], 'or')
const pollSizeChangeComputed = createProvideComputed(
	'pollSizeChange',
	[formItemProvide, props],
	'or'
)
const { focusHandler, blurHandler, wrapperMousedownHandler } = useFocusMode(
	{
		onFocus: (e, isFirstFocus) => {
			if (isFirstFocus) {
				emits('focus', e)
			}
		},
		onBlur: (e) => {
			emits('blur', e)
			formItemProvide?.blurHandler()
		}
	},
	rateRef
)

const checkActive = (index: number) => {
	if (hoverValue.value) {
		return hoverValue.value > index - 1
	}
	return !!modelValue.value && modelValue.value > index - 1
}

const checkHalf = (index: number) => {
	if (!props.allowHalf) return false
	if (hoverValue.value) {
		return hoverValue.value === index - 0.5
	}
	return modelValue.value === index - 0.5
}

let clearFlag = false
const doHoverValue = (e: MouseEvent, index: number) => {
	if (disabledComputed.value || readonlyComputed.value) return
	const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
	const isHalf = props.allowHalf ? e.clientX - rect.left < rect.width / 2 : false
	hoverValue.value = index - (isHalf ? 0.5 : 0)
}
const rateItemMouseenterHandler = (e: MouseEvent, index: number) => {
	doHoverValue(e, index)
}
const rateItemMousemoveHandler = (e: MouseEvent, index: number) => {
	if (clearFlag) {
		return
	}
	doHoverValue(e, index)
}

const rateItemMouseleaveHandler = () => {
	clearFlag = false
	hoverValue.value = 0
}

watch([disabledComputed, readonlyComputed], () => {
	if (disabledComputed.value || readonlyComputed.value) {
		hoverValue.value = 0
	}
})

const rateItemClickHandler = (e: MouseEvent, index: number) => {
	if (disabledComputed.value || readonlyComputed.value) return
	const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
	const isHalf = props.allowHalf ? e.clientX - rect.left < rect.width / 2 : false
	const newValue = index - (isHalf ? 0.5 : 0)
	if (props.clearable) {
		if (newValue === modelValue.value) {
			updateModelValue(0)
			clearFlag = true
			emits('change', 0, e)
			emits('clear', 0, e)
			formItemProvide?.changeHandler()
			nextTick(() => {
				hoverValue.value = 0
			})
			return
		}
	}
	updateModelValue(newValue)
	emits('select', newValue, e)
	emits('change', newValue, e)
	formItemProvide?.changeHandler()
}
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
