import { createVNode, nextTick, ref, render, type Ref, type VNode } from 'vue'
import type { NotificationProps } from '../notification/type'
import type { NotificationBoxProps, NotificationOptions, NotificationReturn } from './type'
import NotificationBox from './notification-box.vue'
import { nanoid } from 'nanoid'
import { isFunction, isString } from 'parsnip-kit'
import type { ValidContent } from '../share/type'

class NotificationManager {
	notifications: Ref<NotificationProps[]>
	notificationBox: VNode
	container: HTMLElement | null = null
	constructor(
		options: Required<Omit<NotificationBoxProps, 'notifications' | 'position' | 'zIndex'>> & {
			root: string | HTMLElement
		}
	) {
		this.notifications = ref<NotificationProps[]>([])
		this.notificationBox = createVNode(NotificationBox, {
			notifications: this.notifications.value,
			placement: options.placement,
			onClose: (id: number | string | symbol) => {
				const idx = this.notifications.value.findIndex((e) => e.id === id)
				if (idx >= 0) {
					this.notifications.value.splice(idx, 1)
				}
			}
		})
		const root =
			(isString(options.root) ? document.querySelector(options.root) : options.root) ||
			document.body
		const id = nanoid()
		this.container = document.createElement('div')
		this.container.id = id
		this.container.className = `px-notification-box-wrapper`
		root.appendChild(this.container)
		render(this.notificationBox, this.container)
	}
	push(options: NotificationProps) {
		const id = options.id ?? nanoid()
		this.notifications.value.push({
			...options,
			id
		})
		return id
	}
	close(id: number | string | symbol) {
		this.notificationBox.component?.exposed?.close(id)
	}
	clear() {
		this.notifications.value.length = 0
	}
	unmount() {
		if (this.container) {
			const container = this.container
			render(null, container)
			nextTick(() => {
				container.remove()
				this.container = null
			})
		}
	}
}
const notificationManagers: Record<
	NotificationBoxProps['placement'] & string,
	NotificationManager | undefined
> = {
	'top-left': undefined,
	'top-right': undefined,
	'bottom-left': undefined,
	'bottom-right': undefined
}

export type NotificationFunction = {
	(options: ValidContent | NotificationOptions): NotificationReturn
} & {
	[key in NotificationOptions['type'] & string]: (
		options: Omit<NotificationOptions, 'type'> | string
	) => NotificationReturn
}

const notificationCall = (options: ValidContent | NotificationOptions): NotificationReturn => {
	if (isString(options) || isFunction(options)) {
		options = {
			content: options
		}
	}
	const placement = options.placement || 'top-right'
	const currentManager = notificationManagers[placement]
		? notificationManagers[placement]
		: (notificationManagers[placement] = new NotificationManager({
				placement,
				root: options.root || 'body'
			}))

	const id = currentManager.push({
		content: options.content,
		title: options.title,
		icon: options.icon,
		duration: options.duration,
		type: options.type || 'normal',
		color: options.color,
		closable: options.closable,
		placement
	})
	return {
		close: () => currentManager.close(id),
		clear: () => currentManager.clear(),
		unmount: () => {
			currentManager.unmount()
			delete notificationManagers[placement]
		}
	}
}

const notification = notificationCall as NotificationFunction

;(
	['info', 'success', 'warning', 'error', 'loading', 'sakura', 'normal', 'notice'] as const
).forEach((key) => {
	;(notification as any)[key] = (options: ValidContent | Omit<NotificationOptions, 'type'>) => {
		if (isString(options) || isFunction(options)) {
			options = {
				content: options
			}
		}
		return notification({
			...options,
			type: key
		})
	}
})

export default notification
