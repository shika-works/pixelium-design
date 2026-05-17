import { nanoid } from 'nanoid'
import { ref, type Ref } from 'vue'
import { OverlayManager } from './base'

export class ListOverlayManager<
	Options extends { root?: string | HTMLElement },
	S extends Record<string, any>
> extends OverlayManager<Options> {
	protected items: Ref<S[]>

	constructor(options: Options) {
		super(options)
		this.items = ref([])
	}

	push(options: S): string | number | symbol {
		const id = options.id ?? nanoid()
		this.items.value.push({ ...options, id })
		return id
	}

	close(id: string | number | symbol) {
		this.vnode?.component?.exposed?.close(id)
	}

	clear() {
		this.items.value.length = 0
	}
}
