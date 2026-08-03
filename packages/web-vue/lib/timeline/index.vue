<script setup lang="tsx">
import { computed, getCurrentInstance, provide, ref, toRef, useSlots, withScopeId } from 'vue'
import type { TimelineProps, TimelineProvide } from './type'
import { TIMELINE_PROVIDE } from '../share/const/provide-key'
import { flattenVNodes } from '../share/util/render'
import { useScreenWidth } from '../share/hook/use-screen-width'
import { isNumber, isObjectLike } from 'parsnip-kit'

defineOptions({
	name: 'Timeline'
})

const props = withDefaults(defineProps<TimelineProps>(), {
	direction: 'vertical',
	contentPlacement: 'end',
	size: 'medium',
	contentSpan: 70,
	smooth: false
})

const horizontal = computed(() => {
	return props.direction !== 'vertical'
})

const hasMark = ref(false)

const [widthType] = useScreenWidth()
const contentSpan = computed(() => {
	if (isNumber(props.contentSpan)) {
		return props.contentSpan
	}
	return props.contentSpan[widthType.value] || 70
})

provide<TimelineProvide>(TIMELINE_PROVIDE, {
	horizontal,
	contentPlacement: toRef(props, 'contentPlacement'),
	size: toRef(props, 'size'),
	pollSizeChange: toRef(props, 'pollSizeChange'),
	smooth: toRef(props, 'smooth'),
	hasMark,
	contentSpan
})

const slots = useSlots()
const instance = getCurrentInstance()

const isTimelineItem = (vnode: any) => {
	const type = vnode.type
	return isObjectLike(type) && 'name' in type && type.name === 'TimelineItem'
}

const hasTimelineItemMark = (vnode: any) => {
	if (vnode.props?.mark) {
		return true
	}
	return typeof vnode.children?.mark === 'function'
}

defineRender(() => {
	const children = flattenVNodes(slots.default?.() || [])
	hasMark.value = children.some((e) => isTimelineItem(e) && hasTimelineItemMark(e))

	const scopeId = instance?.vnode.scopeId
	const render = () => (
		<div
			class={[
				'pixelium',
				'px-timeline',
				horizontal.value ? 'px-timeline__horizontal' : 'px-timeline__vertical',
				`px-timeline__${props.size}`,
				`px-timeline__content-placement-${props.contentPlacement}`
			]}
		>
			{children}
		</div>
	)
	return scopeId ? withScopeId(scopeId)(render)() : render()
})
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
