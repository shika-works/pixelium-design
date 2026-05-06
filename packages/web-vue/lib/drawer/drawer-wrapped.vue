<script setup lang="ts">
import { computed, mergeProps, useAttrs } from 'vue'
import Drawer from './drawer.vue'
import type { DrawerEvents, DrawerExpose, DrawerProps } from './type'
import { forwardEmits } from '../share/util/reactivity'
import { useControlledMode } from '../share/hook/use-controlled-mode'

defineOptions({
	name: 'Drawer'
})

const props = withDefaults(defineProps<DrawerProps>(), {
	defaultVisible: false,
	visible: undefined,
	title: '',
	closable: true,
	mask: true,
	maskClosable: true,
	destroyOnHide: false,
	escToClose: true,
	placement: 'right'
})

const emits = defineEmits<Omit<DrawerEvents, 'onBeforeOk'>>()
const forward = forwardEmits(emits, ['open', 'close', 'afterOpen', 'afterClose'])
const attrs = useAttrs()

const [visible, setVisible] = useControlledMode('visible', props, emits, {
	defaultField: 'defaultVisible',
	transform: (val) => val || false
})
const exitHandler = async (event: MouseEvent | KeyboardEvent) => {
	await setVisible(false)
	emits('exit', event)
}

defineExpose<DrawerExpose>({
	close: () => {
		setVisible(false)
	},
	open: () => {
		setVisible(true)
	}
})

const mergedProps = computed(() => {
	return mergeProps(props, forward, attrs)
})
</script>

<template>
	<Drawer v-bind="mergedProps" :visible="visible" @exit="exitHandler">
		<template #title>
			<slot name="title" />
		</template>
		<template #default>
			<slot />
		</template>
		<template #footer>
			<slot name="footer" />
		</template>
	</Drawer>
</template>
