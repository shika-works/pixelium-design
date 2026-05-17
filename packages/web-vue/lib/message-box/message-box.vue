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
import type { MessageBoxEvents, MessageBoxExpose, MessageBoxProps } from './type'
import { computed, shallowRef } from 'vue'
import { nanoid } from 'nanoid'
import { useZIndex } from '../share/hook/use-z-index'
import { useControlledMode } from '../share/hook/use-controlled-mode'

defineOptions({
	name: 'MessageBoxInner'
})

const props = withDefaults(defineProps<MessageBoxProps>(), {})

const emits = defineEmits<MessageBoxEvents>()
const [messages, updateMessages] = useControlledMode('messages', props, emits)

const clone = computed(() => {
	return (messages.value || []).map((e) => {
		return {
			...e,
			id: e.id ?? nanoid()
		}
	})
})

const [currentZIndex] = useZIndex('message')

const closeHandler = async (id?: number | string | symbol) => {
	if (isNullish(id)) {
		return
	}
	const pre = clone.value
	const idx = pre.findIndex((item) => item.id === id)
	if (idx >= 0) {
		const cur = [...pre]
		cur.splice(idx, 1)
		await updateMessages(cur)
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

<style src="../share/style/index.css" />
