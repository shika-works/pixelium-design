<script setup lang="tsx">
import {
	ref,
	nextTick,
	useSlots,
	Fragment,
	type VNode,
	shallowRef,
	watch,
	computed,
	onMounted,
	inject,
	useId,
	provide,
	onBeforeUnmount
} from 'vue'
import type { PopupContentGetter, PopupEvents, PopupProps, PopupProvide } from './type'
import { isNullish, throttle } from 'parsnip-kit'
import PopupContent from '../popup-content/index.vue'
import PopupTrigger from '../popup-trigger/index.vue'
import { inBrowser } from '../share/util/env'
import { calcPixelSize } from '../share/util/plot'
import { useCancelableDelay } from '../share/hook/use-cancelable-delay'
import { checkMouseInsideElement, checkMouseInsideElementFromEvent } from '../share/util/dom'
import { POPUP_PROVIDE } from '../share/const/provide-key'
import { getElFromVNode, traversePopupContentGetters } from './util'
import { useMousePosition } from './use-mouse-position'

defineOptions({
	name: 'Popup'
})

const props = withDefaults(defineProps<PopupProps>(), {
	placement: 'top',
	trigger: 'hover',
	offset: 8,
	variant: 'light',
	root: 'body',
	arrow: true,
	visible: undefined,
	defaultVisible: undefined,
	widthEqual: false,
	destroyOnHide: false,
	cascade: false
})

const controlledMode = computed(() => {
	return props.visible !== undefined
})

const preDisplay = controlledMode.value ? props.visible : props.defaultVisible

const display = ref<boolean>(isNullish(preDisplay) ? false : preDisplay)

const contentRef = shallowRef<InstanceType<typeof PopupContent> | undefined>()
const triggerRef = shallowRef<InstanceType<typeof PopupTrigger> | undefined>()

const emits = defineEmits<PopupEvents>()

const currentTrigger = shallowRef<null | SVGElement | HTMLElement>(null)

let rafId: number | null = null

const [wait, cancel] = useCancelableDelay(250)

const id = useId()
const popupContentGetterList = ref<PopupContentGetter[]>([])
const popupProvider = props.cascade
	? inject<PopupProvide | undefined>(POPUP_PROVIDE, undefined)
	: undefined

const collectPopup = (
	itemId: string,
	getter: () => InstanceType<typeof PopupContent> | undefined | null,
	children?: PopupContentGetter[]
) => {
	const entry = popupContentGetterList.value.find((e) => e.id === itemId)
	if (entry) {
		entry.getter = getter
		entry.children = children
	} else {
		popupContentGetterList.value.push({
			id: itemId,
			children,
			getter
		})
	}
}
const removePopup = (itemId: string) => {
	const idx = popupContentGetterList.value.findIndex((e) => e.id === itemId)
	if (idx >= 0) {
		popupContentGetterList.value.splice(idx, 1)
	}
}

onMounted(() => {
	popupProvider?.collectPopup(id, () => contentRef.value, popupContentGetterList.value)
})
onBeforeUnmount(() => {
	resizeObserver?.disconnect()
	popupProvider?.removePopup(id)
	if (rafId !== null) {
		if (inBrowser()) {
			cancelAnimationFrame(rafId)
		}
		rafId = null
	}
})

const triggerUpdate = async () => {
	if (props.trigger !== 'click') {
		if (props.cascade && x && y) {
			const contentEl = contentRef.value && contentRef.value.content
			if (contentEl && checkMouseInsideElement(contentEl, x.value, y.value)) {
				return
			}
			const flag = traversePopupContentGetters(popupContentGetterList.value, (content) => {
				return !!(
					content &&
					content.content &&
					checkMouseInsideElement(content.content, x?.value, y?.value)
				)
			})
			if (flag) {
				return
			}
		}
	} else {
		return
	}

	if (controlledMode.value) {
		emits('update:visible', false)
		await nextTick(() => {})
		display.value = !!props.visible
	} else {
		display.value = false
	}
	emits('close')
	popupProvider?.triggerUpdate()
}

if (props.cascade) {
	provide<PopupProvide>(POPUP_PROVIDE, {
		collectPopup,
		removePopup,
		triggerUpdate
	})
}

const [x, y] = props.cascade ? useMousePosition() : [undefined, undefined]

async function openHandler(node: VNode, e: MouseEvent) {
	cancel()
	currentTrigger.value = getElFromVNode(node)
	await openHandlerImpl(currentTrigger.value)
	emits('open', e)
}
async function openHandlerImpl(node: SVGElement | HTMLElement | null, controlled = false) {
	if (node) {
		resizeObserver?.observe(node)
	}
	if (controlledMode.value && !controlled) {
		emits('update:visible', true)
		await nextTick(() => {})
		display.value = !!props.visible
	} else {
		display.value = true
	}
}

async function closeHandler(e: MouseEvent | TouchEvent) {
	if (e.type === 'mouseup' || e.type === 'touchend') {
		const contentEl = contentRef.value && contentRef.value.content
		if (contentEl && checkMouseInsideElementFromEvent(contentEl, e)) {
			return
		}
	}

	if (e.type === 'click') {
		const contentEl = contentRef.value && contentRef.value.content
		let clickContent =
			contentEl &&
			(contentEl.contains(e.target as Node) || checkMouseInsideElementFromEvent(contentEl, e))

		if (props.cascade && !clickContent) {
			clickContent ||= traversePopupContentGetters(popupContentGetterList.value, (content) => {
				return !!(
					content &&
					content.content &&
					checkMouseInsideElementFromEvent(content.content, e)
				)
			})
		}
		if (clickContent) {
			return
		}
	} else if (props.trigger === 'hover') {
		const next = await wait()
		if (!next) {
			return
		}
		if (props.cascade && x && y) {
			const contentEl = contentRef.value && contentRef.value.content
			if (contentEl && checkMouseInsideElement(contentEl, x.value, y.value)) {
				return
			}
			const flag = traversePopupContentGetters(popupContentGetterList.value, (content) => {
				return !!(
					content &&
					content.content &&
					checkMouseInsideElement(content.content, x?.value, y?.value)
				)
			})
			if (flag) {
				return
			}
		}
	}

	if (!display.value) {
		return
	}

	if (controlledMode.value) {
		emits('update:visible', false)
		await nextTick(() => {})
		display.value = !!props.visible
	} else {
		display.value = false
	}
	emits('close', e)
	popupProvider?.triggerUpdate()
}

const contentMouseenterHandler = () => {
	if (props.trigger === 'click') {
		return
	}
	cancel()
}

const dragging = ref(false)

const contentMouseleaveHandler = (e: MouseEvent) => {
	if (props.trigger === 'click') {
		return
	}
	if (dragging.value) {
		return
	}
	closeHandler(e)
}

const preprocessCurrentTrigger = () => {
	if (!inBrowser()) {
		return
	}
	if (!currentTrigger.value && triggerRef.value && triggerRef.value.firstVNode) {
		resizeObserver?.disconnect()
		currentTrigger.value = getElFromVNode(triggerRef.value.firstVNode)
		if (currentTrigger.value instanceof HTMLElement) {
			resizeObserver?.observe(currentTrigger.value)
		}
	}
}

const processVisible = (value: boolean) => {
	if (value) {
		preprocessCurrentTrigger()
		if (currentTrigger.value) {
			openHandlerImpl(currentTrigger.value, true)
		}
	} else {
		display.value = false
		if (props.cascade) {
			popupProvider?.triggerUpdate()
		}
	}
}

watch(
	() => props.visible,
	() => {
		processVisible(!!props.visible)
	}
)

const resizeObserver = inBrowser()
	? new ResizeObserver(() => {
			updateRenderState()
		})
	: null

onMounted(() => {
	nextTick(() => {
		if (display.value) {
			updateRenderState()
		}
	})
})

const updateRenderStateImmediate = () => {
	preprocessCurrentTrigger()
	if (inBrowser()) {
		contentRef.value?.updateRenderState()
	}
}

const updateRenderState = () => {
	if (!inBrowser()) {
		updateRenderStateImmediate()
		return
	}
	if (rafId !== null) {
		return
	}
	rafId = requestAnimationFrame(() => {
		rafId = null
		updateRenderStateImmediate()
	})
}

defineExpose({
	triggerContent: contentRef,
	updateRenderState
})

const slots = useSlots()

const checkCurrentTrigger = (_: any): _ is HTMLElement => {
	if (!inBrowser()) {
		return false
	}
	return currentTrigger.value instanceof HTMLElement
}

const dragHandler = throttle(() => {
	updateRenderState()
}, 20)

const dragStartHandler = () => {
	dragging.value = true
}
const dragEndHandler = (e: MouseEvent | TouchEvent) => {
	dragging.value = false
	if (!currentTrigger.value) {
		closeHandler(e)
	} else {
		const el = currentTrigger.value
		if (!(el instanceof HTMLElement) && !(el instanceof SVGElement)) {
			closeHandler(e)
		} else {
			if (!checkMouseInsideElementFromEvent(el, e)) {
				closeHandler(e)
			}
		}
	}
}

defineRender(() => {
	const pixelSize = calcPixelSize()
	return (
		<Fragment>
			<PopupTrigger
				trigger={props.trigger}
				disabled={props.disabled}
				onClose={closeHandler}
				onOpen={openHandler}
				onDrag={dragHandler}
				onDragStart={dragStartHandler}
				onDragEnd={dragEndHandler}
				// @ts-ignore
				ref={(node: InstanceType<typeof PopupTrigger>) => (triggerRef.value = node)}
			>
				{slots.default?.()}
			</PopupTrigger>
			<PopupContent
				visible={display.value}
				content={props.content}
				zIndex={props.zIndex}
				variant={props.variant}
				placement={props.placement}
				arrow={props.arrow}
				offset={props.offset}
				borderRadius={props.borderRadius ?? pixelSize * 4}
				root={props.root}
				widthEqual={props.widthEqual}
				target={checkCurrentTrigger(currentTrigger.value) ? currentTrigger.value : null}
				onContentMouseenter={contentMouseenterHandler}
				onContentMouseleave={contentMouseleaveHandler}
				contentStyle={props.contentStyle}
				destroyOnHide={props.destroyOnHide}
				// @ts-ignore
				ref={(node: InstanceType<typeof PopupContent>) => (contentRef.value = node)}
				{...props.contentProps}
			>
				{{
					content: slots.content
				}}
			</PopupContent>
		</Fragment>
	)
})
</script>
