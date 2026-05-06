import { defineComponent, h, nextTick, reactive, render, type Reactive, type VNode } from 'vue'
import type { DrawerOptions, DrawerReturn, DrawerEvents } from './type'
import { isFunction, isString } from 'parsnip-kit'
import type { EmitEvent, ValidContent } from '../share/type'
import Drawer from './drawer.vue'
import { nanoid } from 'nanoid'

import DrawerWrapped from './drawer-wrapped.vue'
import { logError } from '../share/util/console'

const ANIMATION_DURATION = 250
const DELAY = 150

type DrawerManagerOptions = Required<Pick<DrawerOptions, 'content' | 'root'>> &
	Omit<DrawerOptions, 'content' | 'root'> &
	EmitEvent<DrawerEvents>

class DrawerManager {
	drawer: VNode
	container: HTMLElement | null = null
	state: Reactive<DrawerManagerOptions & { visible: boolean }>
	timer: any = null
	constructor(options: DrawerManagerOptions) {
		this.state = reactive({
			...options,
			visible: true
		})

		const contentRender = options.content
		const titleRender = options.title
		const footerRender = options.footer

		const that = this
		const component = defineComponent({
			setup() {
				return () =>
					h(Drawer, that.state as any, {
						title: isString(titleRender) ? () => titleRender : titleRender,
						default: isString(contentRender) ? () => contentRender : contentRender,
						footer: isString(footerRender) ? () => footerRender : footerRender
					})
			}
		})

		this.drawer = h(component)
		const root =
			(isString(options.root) ? document.querySelector(options.root) : options.root) ||
			document.body
		const id = nanoid()
		this.container = document.createElement('div')
		this.container.id = id
		this.container.className = `px-drawer-wrapper`
		root.appendChild(this.container)
		render(this.drawer, this.container)
	}
	close() {
		if (this.timer) {
			return
		}
		this.state.visible = false
		this.timer = setTimeout(() => {
			this.unmount()
			this.timer = null
		}, ANIMATION_DURATION + DELAY)
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

const drawerCall = (
	options: ValidContent | (DrawerOptions & EmitEvent<DrawerEvents>)
): DrawerReturn => {
	let currentOptions = options as DrawerOptions & EmitEvent<DrawerEvents>
	if (isString(options) || isFunction(options)) {
		currentOptions = {
			content: options
		}
	}

	currentOptions = Object.assign(currentOptions, {
		root: currentOptions.root || 'body'
	})

	const originCancel = currentOptions.onExit
	currentOptions.onExit = (event) => {
		try {
			originCancel?.call(currentOptions, event)
			currentManager.close()
		} catch (error) {
			logError(error)
		}
	}

	const originClose = currentOptions.onClose
	currentOptions.onClose = () => {
		try {
			originClose?.call(currentOptions)
			currentManager.close()
		} catch (error) {
			logError(error)
		}
	}

	const currentManager = new DrawerManager(currentOptions as any)

	return {
		close: () => currentManager.close()
	}
}

;(DrawerWrapped as any)['open'] = (options: ValidContent | DrawerOptions) => {
	if (isString(options) || isFunction(options)) {
		options = {
			content: options
		}
	}
	return drawerCall({
		...options
	})
}

export default DrawerWrapped as typeof DrawerWrapped & {
	open: (
		options: (DrawerOptions & Omit<EmitEvent<DrawerEvents>, 'update:visible'>) | string
	) => DrawerReturn
}
