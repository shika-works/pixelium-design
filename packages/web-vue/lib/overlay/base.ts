import { nanoid } from 'nanoid'
import { isString } from 'parsnip-kit'
import { nextTick, render, type VNode } from 'vue'

export class OverlayManager<Options extends { root?: string | HTMLElement }> {
	vnode: VNode | null = null
	container: HTMLElement | null = null
	options!: Options

	constructor(options: Options) {
		const root = this.resolveRoot(options.root)
		this.options = options
		this.container = this.createContainer()
		root.appendChild(this.container)
	}

	protected createVNode(): VNode {
		throw new Error('Not implemented')
	}

	protected renderVNode() {
		this.vnode = this.createVNode()
		if (this.container) {
			render(this.vnode, this.container)
		}
	}

	close(..._args: any[]) {
		throw new Error('Not implemented')
	}

	unmount() {
		if (this.container) {
			render(null, this.container)
			nextTick(() => {
				this.container?.remove()
				this.container = null
			})
		}
	}

	private resolveRoot(root?: string | HTMLElement): HTMLElement {
		return (isString(root) ? document.querySelector(root) : root) || document.body
	}

	private createContainer(): HTMLElement {
		const el = document.createElement('div')
		el.id = nanoid()
		el.className = this.getContainerClass()
		return el
	}

	protected getContainerClass(): string {
		throw new Error('Not implemented')
	}
}
