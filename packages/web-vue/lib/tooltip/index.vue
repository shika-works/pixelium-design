<script setup lang="tsx">
import { useSlots, shallowRef, mergeProps } from 'vue'
import type { TooltipEvents, TooltipProps } from './type'
import Popup from '../popup/index.vue'
import { forwardEmits } from '../share/util/reactivity'

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
	defaultVisible: undefined,
	destroyOnHide: false
})

const emits = defineEmits<TooltipEvents>()

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
		<Popup ref={popupRef} {...mergeProps(props, forward)}>
			{{
				default: slots.default,
				content: slots.content
			}}
		</Popup>
	)
})
</script>
