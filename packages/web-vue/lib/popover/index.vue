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
import type { PopoverEvents, PopoverProps } from './type'
import { isNullish } from 'parsnip-kit'
import PopupContent from '../popup-content/index.vue'
import PopupTrigger from '../popup-trigger/index.vue'
import { inBrowser } from '../share/util/env'

defineOptions({
	name: 'Popover'
})

const props = withDefaults(defineProps<PopoverProps>(), {
	placement: 'top',
	trigger: 'hover',
	offset: 8,
	variant: 'light',
	root: 'body',
	arrow: true,
	visible: undefined,
	defaultVisible: undefined,
	widthEqual: false
})

const BORDER_RADIUS = 16
const HOVER_CLOSE_DELAY = 300

const controlledMode = computed(() => {
	return props.visible !== undefined
})

const preDisplay = controlledMode.value ? props.visible : props.defaultVisible

const display = ref<boolean>(isNullish(preDisplay) ? false : preDisplay)

const contentRef = shallowRef<InstanceType<typeof PopupContent> | undefined>()
const triggerRef = shallowRef<InstanceType<typeof PopupTrigger> | undefined>()

const emits = defineEmits<PopoverEvents>()

const currentTrigger = shallowRef<null | VNode>(null)

let closeDelayPromiseReject: (() => void) | undefined

async function openHandler(node: VNode, e: MouseEvent) {
	if (closeDelayPromiseReject) {
		closeDelayPromiseReject()
		closeDelayPromiseReject = undefined
	}
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

async function closeHandler(e: MouseEvent) {
	if (props.trigger === 'click') {
		const clickContent =
			contentRef.value &&
			contentRef.value.content &&
			contentRef.value.content.contains(e.target as HTMLElement)
		if (clickContent || !display.value) {
			return
		}
	} else {
		if (closeDelayPromiseReject) {
			closeDelayPromiseReject()
			closeDelayPromiseReject = undefined
		}
		const { resolve, reject, promise } = Promise.withResolvers<void>()
		closeDelayPromiseReject = reject
		setTimeout(() => {
			resolve()
		}, HOVER_CLOSE_DELAY)
		try {
			await promise
		} catch {
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
	if (closeDelayPromiseReject) {
		closeDelayPromiseReject()
		closeDelayPromiseReject = undefined
	}
}
const contentMouseleaveHandler = (e: MouseEvent) => {
	if (props.trigger === 'click') {
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

defineExpose({
	triggerContent: contentRef,
	updateRenderState
})

const slots = useSlots()

const checkCurrentTrigger = (_: any): _ is HTMLElement => {
	if (!inBrowser()) {
		return false
	}
	return currentTrigger.value?.el instanceof HTMLElement
}

defineRender(() => {
	return (
		<Fragment>
			<PopupTrigger
				trigger={props.trigger}
				disabled={props.disabled}
				onClose={closeHandler}
				onOpen={openHandler}
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
				borderRadius={BORDER_RADIUS}
				root={props.root}
				widthEqual={props.widthEqual}
				target={checkCurrentTrigger(currentTrigger.value?.el) ? currentTrigger.value.el : null}
				onContentMouseenter={contentMouseenterHandler}
				onContentMouseleave={contentMouseleaveHandler}
				contentStyle={props.contentStyle}
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
