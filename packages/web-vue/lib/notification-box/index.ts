import { createVNode } from 'vue'
import type { NotificationProps } from '../notification/type'
import type { NotificationBoxProps, NotificationOptions, NotificationReturn } from './type'
import NotificationBox from './notification-box.vue'
import { isFunction, isString } from 'parsnip-kit'
import type { ValidContent } from '../share/type'
import { ListOverlayManager } from '../overlay/list-overlay'

type NotificationManagerOptions = Required<
	Omit<NotificationBoxProps, 'notifications' | 'position' | 'zIndex'>
> & {
	root: string | HTMLElement
}

class NotificationManager extends ListOverlayManager<
	NotificationManagerOptions,
	NotificationProps
> {
	constructor(options: NotificationManagerOptions) {
		super(options)
		this.renderVNode()
	}

	protected getContainerClass() {
		return 'px-notification-box-wrapper'
	}

	protected createVNode() {
		return createVNode(NotificationBox, {
			notifications: this.items.value,
			placement: this.options.placement,
			onClose: (id: number | string | symbol) => {
				const idx = this.items.value.findIndex((e) => e.id === id)
				if (idx >= 0) this.items.value.splice(idx, 1)
			}
		})
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
