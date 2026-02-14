<script setup lang="ts">
import { useAttrs } from 'vue'
import Dialog from './dialog.vue'
import type { DialogEvents, DialogExpose, DialogProps } from './type'
import { forwardEmits } from '../share/util/reactivity'
import { useControlledMode } from '../share/hook/use-controlled-mode'

defineOptions({
	name: 'Dialog'
})

const props = withDefaults(
	defineProps<
		DialogProps & {
			onBeforeOk?: () => Promise<boolean | void> | boolean | void
		}
	>(),
	{
		defaultVisible: false,
		visible: undefined,
		title: '',
		closable: true,
		mask: true,
		maskClosable: true,
		showCancel: true,
		loading: false,
		showFooter: true,
		destroyOnHide: false,
		escToClose: true
	}
)

const emits = defineEmits<Omit<DialogEvents, 'onBeforeOk'>>()
const forward = forwardEmits(emits, ['open', 'close', 'afterOpen', 'afterClose'])
const attrs = useAttrs()

const [visible, setVisible] = useControlledMode('visible', props, emits, {
	defaultField: 'defaultVisible',
	transform: (val) => val || false
})

const okHandler = async (event: MouseEvent) => {
	await setVisible(false)
	emits('ok', event)
}
const cancelHandler = async (event: MouseEvent | KeyboardEvent) => {
	await setVisible(false)
	emits('cancel', event)
}

defineExpose<DialogExpose>({
	close: () => {
		setVisible(false)
	},
	open: () => {
		setVisible(true)
	}
})
</script>

<template>
	<Dialog
		v-bind="{ ...props, ...forward, ...attrs }"
		:visible="visible"
		@ok="okHandler"
		@cancel="cancelHandler"
	>
		<template #title>
			<slot name="title" />
		</template>
		<template #icon>
			<slot name="icon" />
		</template>
		<template #default>
			<slot />
		</template>
		<template #footer>
			<slot name="footer" />
		</template>
	</Dialog>
</template>
