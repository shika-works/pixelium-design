<script setup lang="tsx">
import { useSlots, Fragment, type VNode, shallowRef, ref, cloneVNode } from 'vue'
import { flattenVNodes, isTextVNode } from '../share/util/render'
import type { PopupTriggerEmits, PopupTriggerProps } from './type'
import { useClickOutsideListener } from '../share/hook/use-click-outside-listener'
import { inBrowser } from '../share/util/env'
import { GET_ELEMENT_RENDERED } from '../share/const'
import { isFunction } from 'parsnip-kit'

defineOptions({
	name: 'PopupTrigger'
})

const props = withDefaults(defineProps<PopupTriggerProps>(), {
	trigger: 'hover'
})

const emits = defineEmits<PopupTriggerEmits>()

const currentTrigger = shallowRef<null | SVGElement | HTMLElement>(null)

async function openHandler(node: VNode, e: MouseEvent) {
	if (inBrowser()) {
		let triggerEl = null
		if (node.el instanceof HTMLElement || node.el instanceof SVGElement) {
			triggerEl = node.el
		} else {
			const getElFunc = node.component?.exposed?.[GET_ELEMENT_RENDERED]
			if (isFunction(getElFunc)) {
				const el = getElFunc()
				if (el instanceof HTMLElement || el instanceof SVGElement) {
					triggerEl = el
				}
			}
		}
		currentTrigger.value = triggerEl
	}

	if (props.disabled) {
		return
	}
	emits('open', node, e)
}

const dragging = ref(false)

async function closeHandler(e: TouchEvent | MouseEvent) {
	if (props.disabled) {
		return
	}
	if (dragging.value) {
		return
	}
	emits('close', e)
}
const slots = useSlots()

const clickOutsideHandler = (event: MouseEvent) => {
	if (props.trigger === 'click') {
		closeHandler(event)
	}
}
useClickOutsideListener(currentTrigger, clickOutsideHandler)

const firstVNodeRef = shallowRef<VNode | null>(null)

defineExpose({
	firstVNode: firstVNodeRef
})

function handleDrag(e: TouchEvent | MouseEvent) {
	emits('drag', e)
}

function stopDrag(e: TouchEvent | MouseEvent) {
	dragging.value = false
	document.removeEventListener('mousemove', handleDrag)
	document.removeEventListener('mouseup', stopDrag)
	document.removeEventListener('touchmove', handleDrag)
	document.removeEventListener('touchend', stopDrag)
	emits('dragEnd', e)
}

const startDrag = (e: TouchEvent | MouseEvent) => {
	dragging.value = true
	document.addEventListener('mousemove', handleDrag)
	document.addEventListener('mouseup', stopDrag)
	document.addEventListener('touchmove', handleDrag)
	document.addEventListener('touchend', stopDrag)
	emits('dragStart', e)
}

const initCurrentTrigger = (e: any) => {
	if (currentTrigger.value) {
		return
	}
	if (e instanceof HTMLElement || e instanceof SVGElement) {
		currentTrigger.value = e
	}
}

defineRender(() => {
	const children = flattenVNodes(slots.default?.() || [])
	return (
		<Fragment>
			{children.map((child, index) => {
				if (isTextVNode(child)) {
					const node =
						props.trigger === 'click' ? (
							<span
								onClick={(e: MouseEvent) => openHandler(node, e)}
								onMousedown={startDrag}
								// @ts-ignore
								onTouchstartPassive={startDrag}
								ref={initCurrentTrigger}
							>
								{child}
							</span>
						) : (
							<span
								onMouseenter={(e: MouseEvent) => openHandler(node, e)}
								onMouseleave={(e: MouseEvent) => closeHandler(e)}
								onMousedown={startDrag}
								// @ts-ignore
								onTouchstartPassive={startDrag}
								ref={initCurrentTrigger}
							>
								{child}
							</span>
						)
					if (index === 0) {
						firstVNodeRef.value = node
					}
					return node
				} else {
					const clone = cloneVNode(
						child,
						props.trigger === 'click'
							? {
									onClick: (e: MouseEvent) => openHandler(clone, e),
									onMousedown: startDrag,
									onTouchstart: startDrag,
									ref: initCurrentTrigger
								}
							: {
									onMouseenter: (e: MouseEvent) => openHandler(clone, e),
									onMouseleave: (e: MouseEvent) => closeHandler(e),
									onMousedown: startDrag,
									onTouchstart: startDrag,
									ref: initCurrentTrigger
								},
						true
					)
					if (index === 0) {
						firstVNodeRef.value = clone
					}
					return clone
				}
			})}
		</Fragment>
	)
})
</script>
