<script setup lang="tsx">
import type { BreadcrumbEvents, BreadcrumbProps, BreadcrumbProvide } from './type'
import { Comment, getCurrentInstance, provide, toRef, useId, useSlots, withScopeId } from 'vue'
import { flattenVNodes } from '../share/util/render'
import { BREADCRUMB_PROVIDE } from '../share/const/provide-key'
import { BREADCRUMB_UPDATE } from '../share/const/event-bus-key'
import { emitParentUpdate } from '../share/hook/use-index-of-children'
import { isString } from 'parsnip-kit'

import BreadcrumbItem from '../breadcrumb-item/index.vue'

defineOptions({
	name: 'Breadcrumb'
})

const props = withDefaults(defineProps<BreadcrumbProps>(), {
	options: () => [],
	splitter: '>',
	renderLastText: true
})

const emits = defineEmits<BreadcrumbEvents>()

const selectHandler = (index: number | string | symbol, e: MouseEvent) => {
	emits('select', index, e)
}

const id = useId()

provide<BreadcrumbProvide>(BREADCRUMB_PROVIDE, {
	select: selectHandler,
	renderLastText: toRef(props, 'renderLastText'),
	id
})

emitParentUpdate(BREADCRUMB_UPDATE + `-${id}`)

const instance = getCurrentInstance()
const slots = useSlots()

const renderChildren = () => {
	const children = flattenVNodes(slots.default?.() || []).filter((e) => e.type !== Comment)
	if (!children.length && props.options) {
		return props.options.map((e) => {
			if (isString(e)) {
				return <BreadcrumbItem label={e} index={e}></BreadcrumbItem>
			} else {
				return (
					<BreadcrumbItem
						label={e.label}
						index={e.index}
						disabled={e.disabled}
						clickable={e.clickable}
						href={e.href}
						route={e.route}
						target={e.target}
					></BreadcrumbItem>
				)
			}
		})
	}
	return children
}

const renderSplitter = (disabled: boolean) => {
	return (
		<li
			class={{
				'px-breadcrumb-splitter': true,
				'px-breadcrumb-splitter__disabled': disabled
			}}
		>
			{slots.splitter ? slots.splitter() : props.splitter}
		</li>
	)
}

const render = () => {
	const currentChildren = renderChildren()
	return (
		<div class="pixelium px-breadcrumb">
			<ul class="px-breadcrumb-inner">
				{currentChildren
					.map((e, i) => {
						if (i < currentChildren.length - 1) {
							return [e, renderSplitter(!!e.props?.disabled || e.props?.disabled === '')]
						} else {
							return [e]
						}
					})
					.flat(1)}
			</ul>
		</div>
	)
}

defineRender(() => {
	const scopeId = instance?.vnode.scopeId
	return scopeId ? withScopeId(scopeId)(render)() : render()
})
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
