import { createVNode } from 'vue'
import type { MessageProps } from '../message/type'
import type { MessageBoxProps, MessageOptions, MessageReturn } from './type'
import MessageBox from './message-box.vue'
import { isFunction, isString } from 'parsnip-kit'
import type { ValidContent } from '../share/type'
import { ListOverlayManager } from '../overlay/list-overlay'

type MessageManagerOptions = Required<
	Omit<MessageBoxProps, 'messages' | 'position' | 'zIndex'>
> & {
	root: string | HTMLElement
}

class MessageManager extends ListOverlayManager<MessageManagerOptions, MessageProps> {
	constructor(options: MessageManagerOptions) {
		super(options)
		this.renderVNode()
	}

	protected getContainerClass() {
		return 'px-message-box-wrapper'
	}

	protected createVNode() {
		return createVNode(MessageBox, {
			messages: this.items.value,
			placement: this.options.placement,
			onClose: (id: number | string | symbol) => {
				const idx = this.items.value.findIndex((e) => e.id === id)
				if (idx >= 0) this.items.value.splice(idx, 1)
			}
		})
	}
}

const messageManagers: Record<
	MessageBoxProps['placement'] & string,
	MessageManager | undefined
> = {
	top: undefined,
	bottom: undefined,
	'top-left': undefined,
	'top-right': undefined,
	'bottom-left': undefined,
	'bottom-right': undefined
}

export type MessageFunction = {
	(options: ValidContent | MessageOptions): MessageReturn
} & {
	[key in MessageOptions['type'] & string]: (
		options: Omit<MessageOptions, 'type'> | string
	) => MessageReturn
}

const messageCall = (options: ValidContent | MessageOptions): MessageReturn => {
	if (isString(options) || isFunction(options)) {
		options = {
			content: options
		}
	}
	const placement = options.placement || options.position || 'top'
	const currentManager = messageManagers[placement]
		? messageManagers[placement]
		: (messageManagers[placement] = new MessageManager({
				placement,
				root: options.root || 'body'
			}))

	const id = currentManager.push({
		content: options.content,
		icon: options.icon,
		duration: options.duration || 3000,
		type: options.type || 'normal',
		color: options.color,
		closable: options.closable
	})
	return {
		close: () => currentManager.close(id),
		clear: () => currentManager.clear(),
		unmount: () => {
			currentManager.unmount()
			delete messageManagers[placement]
		}
	}
}

const message = messageCall as MessageFunction

;(
	['info', 'success', 'warning', 'error', 'loading', 'sakura', 'normal', 'notice'] as const
).forEach((key) => {
	;(message as any)[key] = (options: ValidContent | Omit<MessageOptions, 'type'>) => {
		if (isString(options) || isFunction(options)) {
			options = {
				content: options
			}
		}
		return message({
			...options,
			type: key
		})
	}
})

export default message
