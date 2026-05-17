<template>
	<div
		class="px-notification-box"
		:style="{
			zIndex: props.zIndex ?? currentZIndex
		}"
	>
		<div
			class="px-notification-box-container"
			:class="{
				[`px-notification-box-container__${props.placement || 'top-right'}`]: true
			}"
		>
			<Notification
				v-for="notification in clone"
				:key="notification.id"
				:duration="notification.duration"
				:content="notification.content"
				:id="notification.id"
				@close="closeHandler"
				:type="notification.type"
				:color="notification.color"
				:icon="notification.icon"
				:closable="notification.closable"
				:placement="props.placement || 'top-right'"
				:title="notification.title"
				ref="notificationRef"
			></Notification>
		</div>
	</div>
</template>

<script setup lang="ts">
import { isNullish } from 'parsnip-kit'
import Notification from '../notification/index.vue'
import type { NotificationBoxEvents, NotificationBoxExpose, NotificationBoxProps } from './type'
import { computed, shallowRef } from 'vue'
import { nanoid } from 'nanoid'
import { useZIndex } from '../share/hook/use-z-index'
import { useControlledMode } from '../share/hook/use-controlled-mode'

defineOptions({
	name: 'NotificationBoxInner'
})

const props = withDefaults(defineProps<NotificationBoxProps>(), {})

const emits = defineEmits<NotificationBoxEvents>()
const [notifications, updateNotifications] = useControlledMode('notifications', props, emits)

const clone = computed(() => {
	return (notifications.value || []).map((e) => {
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
		await updateNotifications(cur)
	}

	emits('close', id)
}

const notificationRef = shallowRef<InstanceType<typeof Notification>[]>([])

defineExpose<NotificationBoxExpose>({
	close: (id: number | string | symbol) => {
		const idx = clone.value.findIndex((e) => e.id === id)
		if (idx === -1) {
			return
		}
		notificationRef.value[idx]?.close()
	}
})
</script>

<style lang="less" src="./index.less"></style>

<style src="../share/style/index.css" />
