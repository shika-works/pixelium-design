<template>
	<Teleport :to="props.root">
		<NotificationBox v-bind="mergedProps" ref="notificationBoxRef"></NotificationBox>
	</Teleport>
</template>

<script setup lang="ts">
import NotificationBox from './notification-box.vue'
import type { NotificationBoxEvents, NotificationBoxExpose, NotificationBoxProps } from './type'
import { computed, mergeProps, ref, Teleport, useAttrs } from 'vue'
import { forwardEmits } from '../share/util/reactivity'

defineOptions({
	name: 'NotificationBox'
})

const props = withDefaults(defineProps<NotificationBoxProps>(), {
	root: 'body'
})

const emits = defineEmits<NotificationBoxEvents>()
const forward = forwardEmits(emits, ['close', 'update:notifications'])

const attrs = useAttrs()
const notificationBoxRef = ref<null | InstanceType<typeof NotificationBox>>(null)

const mergedProps = computed(() => {
	return mergeProps(props, forward, attrs)
})

defineExpose<NotificationBoxExpose>({
	close: (id: number | string | symbol) => {
		notificationBoxRef.value?.close(id)
	}
})
</script>
