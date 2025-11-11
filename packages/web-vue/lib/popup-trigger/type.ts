import type { VNode } from 'vue'

export type PopupTriggerProps = {
	trigger?: 'hover' | 'click'
	disabled?: boolean
}

export type PopupTriggerEmits = {
	close: [e: TouchEvent | MouseEvent]
	open: [node: VNode, e: MouseEvent]
	drag: [event: TouchEvent | MouseEvent]
}
