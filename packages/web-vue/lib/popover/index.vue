<script setup lang="tsx">
import { useSlots, shallowRef, useAttrs } from 'vue'
import Popup from '../popup/index.vue'
import type { PopoverProps, PopoverEvents } from './type'
import { forwardEmits } from '../share/util/reactivity'

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
	widthEqual: false,
	destroyOnHide: false
})

const attrs = useAttrs()
const emits = defineEmits<PopoverEvents>()

const popupRef = shallowRef<InstanceType<typeof Popup> | null>(null)

defineExpose({
	get triggerContent() {
		return popupRef.value?.triggerContent
	},
	updateRenderState() {
		popupRef.value?.updateRenderState()
	}
})

const slots = useSlots()

const forward = forwardEmits(emits, ['open', 'close', 'update:visible'])

defineRender(() => {
	return (
		<Popup ref={popupRef} {...{ ...props, ...forward, ...attrs }}>
			{{
				default: slots.default,
				content: slots.content
			}}
		</Popup>
	)
})
</script>
