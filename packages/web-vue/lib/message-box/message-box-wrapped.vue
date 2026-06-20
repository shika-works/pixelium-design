<template>
	<Teleport :to="props.root">
		<MessageBox v-bind="mergedProps" ref="messageBoxRef"></MessageBox>
	</Teleport>
</template>

<script setup lang="ts">
import MessageBox from './message-box.vue'
import type { MessageBoxEvents, MessageBoxExpose, MessageBoxProps } from './type'
import { computed, mergeProps, ref, Teleport, useAttrs } from 'vue'
import { forwardEmits } from '../share/util/reactivity'

defineOptions({
	name: 'MessageBox'
})

const props = withDefaults(defineProps<MessageBoxProps>(), {
	root: 'body'
})

const emits = defineEmits<MessageBoxEvents>()
const forward = forwardEmits(emits, ['close', 'update:messages'])

const attrs = useAttrs()
const messageBoxRef = ref<null | InstanceType<typeof MessageBox>>(null)

const mergedProps = computed(() => {
	return mergeProps(props, forward, attrs)
})

defineExpose<MessageBoxExpose>({
	close: (id: number | string | symbol) => {
		messageBoxRef.value?.close(id)
	}
})
</script>
