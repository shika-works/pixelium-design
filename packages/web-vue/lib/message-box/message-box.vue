<template>
	<div
		class="px-message-box"
		:style="{
			zIndex: props.zIndex ?? currentZIndex
		}"
	>
		<div
			class="px-message-box-container"
			:class="{
				[`px-message-box-container__${props.placement || props.position || 'top'}`]: true
			}"
		>
			<Message
				v-for="message in clone"
				:key="message.id"
				:duration="message.duration"
				:content="message.content"
				:id="message.id"
				@close="closeHandler"
				:type="message.type"
				:color="message.color"
				:icon="message.icon"
				:closable="message.closable"
				ref="messageRef"
			></Message>
		</div>
	</div>
</template>

<script setup lang="ts">
import { isNullish } from 'parsnip-kit'
import Message from '../message/index.vue'
import type { MessageProps } from '../message/type'
import type { MessageBoxEvents, MessageBoxExpose, MessageBoxProps } from './type'
import { computed, shallowRef, useModel } from 'vue'
import { nanoid } from 'nanoid'
import { useZIndex } from '../share/hook/use-z-index'

defineOptions({
	name: 'MessageBoxInner'
})

const props = withDefaults(
	defineProps<MessageBoxProps & { 'onUpdate:messages': (value: MessageProps[]) => any }>(),
	{
		position: 'top',
		placement: 'top'
	}
)

const [currentZIndex] = useZIndex('message')

const messages = useModel(props, 'messages')

const emits = defineEmits<Pick<MessageBoxEvents, 'close'>>()

const clone = computed(() => {
	return messages.value.map((e) => {
		return {
			...e,
			id: e.id ?? nanoid()
		}
	})
})
const closeHandler = (id?: number | string | symbol) => {
	if (isNullish(id)) {
		return
	}

	if (props['onUpdate:messages']) {
		const idx = clone.value.findIndex((item) => item.id === id)
		if (idx >= 0) {
			const cur = [...clone.value]
			cur.splice(idx, 1)
			messages.value = cur
		}
	}
	emits('close', id)
}

const messageRef = shallowRef<InstanceType<typeof Message>[]>([])

defineExpose<MessageBoxExpose>({
	close: (id: number | string | symbol) => {
		const idx = clone.value.findIndex((e) => e.id === id)
		if (idx === -1) {
			return
		}
		messageRef.value[idx]?.close()
	}
})
</script>

<style lang="less" src="./index.less"></style>
