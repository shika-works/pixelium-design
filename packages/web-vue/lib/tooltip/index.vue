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
import type { TooltipEvents, TooltipProps } from './type'
import { isNullish, throttle } from 'parsnip-kit'
import PopupContent from '../popup-content/index.vue'
import PopupTrigger from '../popup-trigger/index.vue'
import { inBrowser } from '../share/util/env'
import { calcPixelSize } from '../share/util/plot'
import { useCancelableDelay } from '../share/hook/use-cancelable-delay'
import { checkMouseInsideElementFromEvent } from '../share/util/dom'

defineOptions({
	name: 'Tooltip'
})

const props = withDefaults(defineProps<TooltipProps>(), {
	placement: 'top',
	trigger: 'hover',
	offset: 8,
	variant: 'dark',
	root: 'body',
	arrow: true,
	visible: undefined,
	defaultVisible: undefined
})

const controlledMode = computed(() => {
	return props.visible !== undefined
})

const preDisplay = controlledMode.value ? props.visible : props.defaultVisible

const display = ref<boolean>(isNullish(preDisplay) ? false : preDisplay)

const contentRef = shallowRef<InstanceType<typeof PopupContent> | undefined>()
const triggerRef = shallowRef<InstanceType<typeof PopupTrigger> | undefined>()

const emits = defineEmits<TooltipEvents>()

const currentTrigger = shallowRef<null | VNode>(null)

const [wait, cancel] = useCancelableDelay()

async function openHandler(node: VNode, e: MouseEvent) {
	cancel()
	await openHandlerImpl(node)
	emits('open', e)
}
async function openHandlerImpl(node: VNode, controlled = false) {
	if (inBrowser()) {
		resizeObserver?.disconnect()
		if (node.el instanceof HTMLElement) {
			currentTrigger.value = node
		} else {
			currentTrigger.value = null
		}
		if (currentTrigger.value && currentTrigger.value.el instanceof HTMLElement) {
			resizeObserver?.observe(currentTrigger.value.el)
		}
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
		currentTrigger.value = triggerRef.value.firstVNode
		if (currentTrigger.value.el instanceof HTMLElement) {
			resizeObserver?.observe(currentTrigger.value.el)
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

const dragHandler = throttle(() => {
	updateRenderState()
}, 20)

const slots = useSlots()

const checkCurrentTrigger = (_: any): _ is HTMLElement => {
	if (!inBrowser()) {
		return false
	}
	return currentTrigger.value?.el instanceof HTMLElement
}

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
				target={checkCurrentTrigger(currentTrigger.value?.el) ? currentTrigger.value.el : null}
				onContentMouseenter={contentMouseenterHandler}
				onContentMouseleave={contentMouseleaveHandler}
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
