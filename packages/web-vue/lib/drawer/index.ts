import { defineComponent, h, reactive } from 'vue'
import type { DrawerOptions, DrawerReturn, DrawerEvents } from './type'
import { isFunction, isString } from 'parsnip-kit'
import type { EmitEvent, ValidContent } from '../share/type'
import Drawer from './drawer.vue'

import DrawerWrapped from './drawer-wrapped.vue'
import { logError } from '../share/util/console'
import { ModalOverlayManager } from '../overlay/modal-overlay'

type DrawerManagerOptions = Required<Pick<DrawerOptions, 'content' | 'root'>> &
	Omit<DrawerOptions, 'content' | 'root'> &
	EmitEvent<DrawerEvents>

type DrawerManagerState = DrawerManagerOptions & { visible: boolean }
class DrawerManager extends ModalOverlayManager<DrawerManagerOptions, DrawerManagerState> {
	constructor(options: DrawerManagerOptions) {
		super(options)
		this.renderVNode()
	}
	protected getContainerClass(): string {
		return 'px-drawer-wrapper'
	}
	protected initState() {
		return reactive({
			...this.options,
			visible: true
		})
	}
	protected createVNode() {
		const contentRender = this.options.content
		const titleRender = this.options.title
		const footerRender = this.options.footer
		const component = defineComponent({
			setup: () => {
				return () =>
					h(Drawer, this.state as any, {
						title: isString(titleRender) ? () => titleRender : titleRender,
						default: isString(contentRender) ? () => contentRender : contentRender,
						footer: isString(footerRender) ? () => footerRender : footerRender
					})
			}
		})

		return h(component)
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
