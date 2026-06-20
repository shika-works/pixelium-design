import type { Reactive } from 'vue'
import { OverlayManager } from './base'

const ANIMATION_DURATION = 250
const DELAY = 150

export class ModalOverlayManager<
	Options extends { root?: string | HTMLElement },
	State extends Options & { visible: boolean }
> extends OverlayManager<Options> {
	protected state!: Reactive<State>
	protected animationDuration!: number
	protected timer: any = null

	constructor(options: Options) {
		super(options)
		this.animationDuration = ANIMATION_DURATION + DELAY
		this.state = this.initState()
	}

	protected initState(): Reactive<State> {
		throw new Error('Not implemented')
	}
	close() {
		if (this.timer) {
			return
		}
		this.state.visible = false
		this.timer = setTimeout(() => {
			this.unmount()
			this.timer = null
		}, this.animationDuration)
	}
}
