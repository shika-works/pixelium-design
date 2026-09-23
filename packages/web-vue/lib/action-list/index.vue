<script setup lang="tsx">
import {
	computed,
	getCurrentInstance,
	mergeProps,
	provide,
	shallowRef,
	useAttrs,
	useId,
	useSlots
} from 'vue'
import type {
	ActionListEvents,
	ActionListItemData,
	ActionListProps,
	ActionListProvide
} from './type'
import type { ActionListItemIndex } from '../action-list-item/type'
import { ACTION_LIST_PROVIDE } from '../share/const/provide-key'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import { useExpandTransition } from '../share/hook/use-expand-transition'
import { useLocale } from '../share/util/locale'
import ActionListItem from '../action-list-item/index.vue'
import ChevronUp from '../chevron-up/index.vue'
import { isFunction, isNullish, isNumber } from 'parsnip-kit'
import { getScopedObj } from '../share/util/render.ts'
import { emitParentUpdate } from '../share/hook/use-index-of-children.ts'
import { ACTION_LIST_UPDATE } from '../share/const/event-bus-key.ts'

defineOptions({
	name: 'ActionList'
})

const props = withDefaults(defineProps<ActionListProps>(), {
	size: 'medium',
	lineVariant: 'solid',
	animationDuration: 250,
	collapsible: false,
	maxDisplayItems: 3,
	collapsed: undefined,
	defaultCollapsed: undefined,
	foldPlacement: 'start'
})

const emits = defineEmits<ActionListEvents>()

const slots = useSlots()

const [t] = useLocale()

const [expandedIndices, updateExpandedIndices] = useControlledMode('expanded', props, emits, {
	defaultField: 'defaultExpanded'
})

const [collapsedState, updateCollapsedState] = useControlledMode('collapsed', props, emits, {
	defaultField: 'defaultCollapsed',
	transform: (val?: boolean | null) => !!val
})

const toggle = (index: ActionListItemIndex) => {
	const current = expandedIndices.value ?? []
	const next = current.includes(index)
		? current.filter((item) => item !== index)
		: [...current, index]
	updateExpandedIndices(next)
	emits('expandedChange', [...next])
}

const id = useId()

provide<ActionListProvide>(ACTION_LIST_PROVIDE, {
	size: computed(() => props.size),
	spacing: computed(() => props.spacing),
	lineVariant: computed(() => props.lineVariant),
	animationDuration: computed(() => props.animationDuration),
	expandedIndices,
	toggle,
	id
})

emitParentUpdate(ACTION_LIST_UPDATE + `-${id}`)

const itemIndex = (item: ActionListItemData, index: number) => item.index ?? index

const totalCount = computed(() => props.items?.length ?? 0)

const foldable = computed(() => {
	return (
		props.collapsible &&
		isNumber(props.maxDisplayItems) &&
		props.maxDisplayItems >= 0 &&
		totalCount.value > props.maxDisplayItems
	)
})

const folded = computed(() => foldable.value && !!collapsedState.value)

const itemsRef = shallowRef<HTMLDivElement | null>(null)

useExpandTransition(itemsRef, undefined, folded, () => props.animationDuration, 'content')

const displayedItems = computed(() => {
	const list = props.items ?? []
	const shown = folded.value ? list.slice(0, props.maxDisplayItems) : list
	return shown.map((item, index) => ({ item, index }))
})

const hiddenCount = computed(() => totalCount.value - displayedItems.value.length)

const foldText = computed(() => {
	if (!folded.value) {
		return t('action-list.unfold')
	}
	const format = t<Function>('action-list.fold')
	return isFunction(format) ? format(hiddenCount.value) : ''
})

const foldStyle = computed(() => {
	const spacingValue = props.spacing
	if (spacingValue === undefined || spacingValue === null || spacingValue === '') {
		return undefined
	}
	return {
		paddingTop: isNumber(spacingValue) ? `${spacingValue}px` : spacingValue
	}
})

const toggleFoldHandler = () => {
	const next = !folded.value
	updateCollapsedState(next)
	emits('collapsedChange', next)
}

const itemToggleHandler = (
	item: ActionListItemData,
	expanded: boolean,
	index: ActionListItemIndex
) => {
	emits('itemExpandedChange', item, expanded, index)
}

const instance = getCurrentInstance()
const attrs = useAttrs()
const scopedObj = getScopedObj(instance)
const mergedProps = computed(() => {
	return mergeProps(
		{
			class: [
				'pixelium',
				'px-action-list',
				`px-action-list__${props.size}`,
				`px-action-list__line-${props.lineVariant}`,
				`px-action-list__fold-${props.foldPlacement}`
			]
		},
		attrs,
		scopedObj
	)
})

const validSlot = (slot: any) => {
	return !isNullish(slot) && slot !== ''
}

const render = () => {
	return (
		<div {...mergedProps.value}>
			{foldable.value && (
				<div class="px-action-list-fold" style={foldStyle.value} onClick={toggleFoldHandler}>
					<div class="px-action-list-fold-text">
						{slots.fold
							? slots.fold({
									collapsed: folded.value,
									hiddenCount: hiddenCount.value,
									total: totalCount.value
								})
							: foldText.value}
					</div>
					<ChevronUp
						class="px-action-list-fold-arrow"
						active={!folded.value}
						rotate={90}
						activeRotate={props.foldPlacement === 'end' ? 0 : 180}
						duration={props.animationDuration}
					/>
				</div>
			)}
			<div class="px-action-list-items" ref={itemsRef}>
				{props.items
					? displayedItems.value.map(({ item, index }) => {
							return (
								<ActionListItem
									key={itemIndex(item, index)}
									index={itemIndex(item, index)}
									status={item.status}
									ellipsis={item.ellipsis}
									color={item.color}
									spacing={item.spacing}
									lineVariant={item.lineVariant}
									expandable={item.expandable}
									onExpandedChange={(expanded: boolean) =>
										itemToggleHandler(item, expanded, itemIndex(item, index))
									}
								>
									{{
										detail: validSlot(item.detail)
											? () => (isFunction(item.detail) ? item.detail() : item.detail)
											: undefined,
										content: validSlot(item.content)
											? () => (isFunction(item.content) ? item.content() : item.content)
											: undefined,
										title: validSlot(item.title)
											? () => (isFunction(item.title) ? item.title() : item.title)
											: undefined
									}}
								</ActionListItem>
							)
						})
					: slots.default
						? slots.default()
						: null}
			</div>
		</div>
	)
}

defineRender(() => {
	return render()
})
</script>

<template></template>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
