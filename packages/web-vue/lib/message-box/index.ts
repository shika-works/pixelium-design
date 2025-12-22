import { createVNode, nextTick, ref, render, type Ref, type VNode } from 'vue'
import type { MessageProps } from '../message/type'
import type { MessageBoxProps, MessageOptions, MessageReturn } from './type'
import MessageBox from './message-box.vue'
import { nanoid } from 'nanoid'
import { isFunction, isString } from 'parsnip-kit'
import type { ValidContent } from '../share/type'

class MessageManager {
	messages: Ref<MessageProps[]>
	messageBox: VNode
	container: HTMLElement | null = null
	constructor(
		options: Required<Omit<MessageBoxProps, 'messages' | 'position' | 'zIndex'>> & {
			root: string | HTMLElement
		}
	) {
		this.messages = ref<MessageProps[]>([])
		this.messageBox = createVNode(MessageBox, {
			messages: this.messages.value,
			placement: options.placement,
			onClose: (id: number | string | symbol) => {
				const idx = this.messages.value.findIndex((e) => e.id === id)
				if (idx >= 0) {
					this.messages.value.splice(idx, 1)
				}
			}
		})
		const root =
			(isString(options.root) ? document.querySelector(options.root) : options.root) ||
			document.body
		const id = nanoid()
		this.container = document.createElement('div')
		this.container.id = id
		this.container.className = `px-message-box-wrapper`
		root.appendChild(this.container)
		render(this.messageBox, this.container)
	}
	push(options: MessageProps) {
		const id = options.id ?? nanoid()
		this.messages.value.push({
			...options,
			id
		})
		return id
	}
	close(id: number | string | symbol) {
		this.messageBox.component?.exposed?.close(id)
	}
	clear() {
		this.messages.value.length = 0
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

export type MessageFunction = (options: ValidContent | MessageOptions) => MessageReturn & {
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
		clear: () => currentManager.clear()
	}
}

const message = messageCall as MessageFunction

;(['info', 'success', 'warning', 'error', 'loading', 'sakura', 'normal'] as const).forEach(
	(key) => {
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
	}
)

export default message
