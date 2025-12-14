<template>
	<Teleport :to="props.root">
		<MessageBox v-bind="{ ...props, ...attrs }" ref="messageBoxRef"></MessageBox>
	</Teleport>
</template>

<script setup lang="ts">
import MessageBox from './message-box.vue'
import type { MessageProps } from '../message/type'
import type { MessageBoxExpose, MessageBoxProps } from './type'
import { ref, Teleport, useAttrs } from 'vue'

defineOptions({
	name: 'MessageBox'
})

const props = withDefaults(
	defineProps<
		MessageBoxProps & {
			'onUpdate:messages': (value: MessageProps[]) => any
			onClose: (id: string | number | symbol) => any
		}
	>(),
	{
		root: 'body'
	}
)

const attrs = useAttrs()
const messageBoxRef = ref<null | InstanceType<typeof MessageBox>>(null)

defineExpose<MessageBoxExpose>({
	close: (id: number | string | symbol) => {
		messageBoxRef.value?.close(id)
	}
})
</script>
