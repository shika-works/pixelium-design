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
	onMounted
} from 'vue'
import type { PopupEvents, PopupProps } from './type'
import { isFunction, isNullish, throttle } from 'parsnip-kit'
import PopupContent from '../popup-content/index.vue'
import PopupTrigger from '../popup-trigger/index.vue'
import { inBrowser } from '../share/util/env'
import { calcPixelSize } from '../share/util/plot'
import { useCancelableDelay } from '../share/hook/use-cancelable-delay'
import { checkMouseInsideElementFromEvent } from '../share/util/dom'
import { GET_ELEMENT_RENDERED } from '../share/const'
import { logWarn } from '../share/util/console'

// TODO: Refactor duplicate functionality between popup-trigger and popup components.
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
	destroyOnHide: false
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

const [wait, cancel] = useCancelableDelay()

const getElFromVNode = (node: VNode) => {
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
			if (triggerEl === null) {
				logWarn(
					`Please ensure that the root node of the default slot passed to Tooltip, Popover, and similar components can be rendered as a DOM element, or expose a getElementRender function on the component to retrieve the DOM element for balloon attachment.`
				)
			}
		}
		return triggerEl
	} else {
		return null
	}
}

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

	if (props.trigger === 'click') {
		const clickContent =
			contentRef.value &&
			contentRef.value.content &&
			contentRef.value.content.contains(e.target as HTMLElement)
		if (clickContent || !display.value) {
			return
		}
	} else {
		const next = await wait()
		if (!next) {
			return
		}
	}

	if (controlledMode.value) {
		emits('update:visible', false)
		await nextTick(() => {})
		display.value = !!props.visible
	} else {
		display.value = false
	}
	emits('close', e)
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

const updateRenderState = () => {
	preprocessCurrentTrigger()
	if (inBrowser()) {
		contentRef.value?.updateRenderState()
	}
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
const dragEndHandler = () => {
	dragging.value = false
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
				borderRadius={pixelSize * 4}
				root={props.root}
				widthEqual={props.widthEqual}
				target={checkCurrentTrigger(currentTrigger.value) ? currentTrigger.value : null}
				onContentMouseenter={contentMouseenterHandler}
				onContentMouseleave={contentMouseleaveHandler}
				contentStyle={props.contentStyle}
				destroyOnHide={props.destroyOnHide}
				// @ts-ignore
				ref={(node: InstanceType<typeof PopupContent>) => (contentRef.value = node)}
			>
				{{
					content: slots.content
				}}
			</PopupContent>
		</Fragment>
	)
})
</script>
