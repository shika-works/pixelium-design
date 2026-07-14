<script setup lang="ts">
import { provide, toRef } from 'vue'
import type { CollapseProps, CollapseEvents, CollapseProvide } from './type'
import { COLLAPSE_PROVIDE } from '../share/const/provide-key'
import { useControlledMode } from '../share/hook/use-controlled-mode'

defineOptions({
	name: 'Collapse'
})

const props = withDefaults(defineProps<CollapseProps>(), {
	animationDuration: 250,
	showExpandIcon: true,
	expandIconPlacement: 'left',
	variant: 'card',
	destroyOnHide: true,
	disabled: false
})

const emit = defineEmits<CollapseEvents>()

const [activeIndices, updateActiveIndices] = useControlledMode('active', props, emit, {
	defaultField: 'defaultActive'
})

const toggle = (index: string | number | symbol) => {
	const current = activeIndices.value ?? []
	if (props.accordion) {
		const next = current.includes(index) ? [] : [index]
		updateActiveIndices(next)
		emit('change', next)
	} else {
		const i = current.indexOf(index)
		const next = i > -1 ? current.filter((n) => n !== index) : [...current, index]
		updateActiveIndices(next)
		emit('change', next)
	}
}

provide<CollapseProvide>(COLLAPSE_PROVIDE, {
	activeIndices: activeIndices,
	accordion: toRef(props, 'accordion'),
	toggle,
	animationDuration: toRef(props, 'animationDuration'),
	showExpandIcon: toRef(props, 'showExpandIcon'),
	expandIconPlacement: toRef(props, 'expandIconPlacement'),
	destroyOnHide: toRef(props, 'destroyOnHide'),
	disabled: toRef(props, 'disabled'),
	variant: toRef(props, 'variant'),
	pollSizeChange: toRef(props, 'pollSizeChange')
})
</script>

<template>
	<div class="pixelium px-collapse">
		<slot></slot>
	</div>
</template>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
