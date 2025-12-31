<script setup lang="ts">
import { mergeProps, shallowRef } from 'vue'
import Popover from '../popover/index.vue'
import type { DropDownEvents, DropDownExpose, DropDownProps } from './type'
import { forwardEmits } from '../share/util/reactivity'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import DropDownList from '../drop-down-list/index.vue'
import type { DropDownListOption } from '../drop-down-list/type'

defineOptions({
	name: 'DropDown'
})

const props = withDefaults(defineProps<DropDownProps>(), {
	placement: 'bottom',
	offset: 8,
	variant: 'light',
	root: 'body',
	disabled: false,
	arrow: true,
	visible: undefined,
	defaultVisible: undefined,
	destroyOnHide: false,
	trigger: 'hover'
})

const emits = defineEmits<DropDownEvents>()

const popupRef = shallowRef<InstanceType<typeof Popover> | null>(null)

defineExpose<DropDownExpose>({
	get triggerContent() {
		return popupRef.value?.triggerContent
	},
	updateRenderState() {
		popupRef.value?.updateRenderState()
	},
	close: () => {
		setVisible(false)
	},
	open: () => {
		setVisible(true)
	}
})

const forward = forwardEmits(emits, ['open', 'close'])

const [visible, setVisible] = useControlledMode('visible', props, emits, {
	defaultField: 'defaultVisible',
	transform: (val) => val || false
})

const selectHandler = async (
	index: number | string | symbol,
	option: string | DropDownListOption,
	e: MouseEvent
) => {
	await setVisible(false)
	emits('select', index, option, e)
}

const visibleUpdateHandler = (value: boolean) => {
	setVisible(value)
}
</script>
<template>
	<Popover
		ref="popupRef"
		:placement="props.placement"
		:trigger="props.trigger"
		:disabled="props.disabled"
		:root="props.root"
		:z-index="props.zIndex"
		:visible="visible"
		@update:visible="visibleUpdateHandler"
		:arrow="props.arrow"
		:border-radius="0"
		:offset="props.offset"
		:variant="props.variant"
		v-bind="mergeProps(forward, props.popoverProps || {})"
	>
		<slot></slot>
		<template #content>
			<DropDownList :options="props.options" @select="selectHandler"></DropDownList>
		</template>
	</Popover>
</template>
<style src="../share/style/index.css" />
