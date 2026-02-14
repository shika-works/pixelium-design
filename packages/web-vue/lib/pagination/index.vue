<script setup lang="tsx">
import { computed, getCurrentInstance, ref, useSlots, watch, withScopeId, type Ref } from 'vue'
import type { PaginationEvents, PaginationProps } from './type'
import { clamp, isFunction, isInfinity, isNanValue, isNumber, unique } from 'parsnip-kit'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import { BEGIN_PAGE, generatePagination } from './util'

import AngleLeft from '@hackernoon/pixel-icon-library/icons/SVG/regular/angle-left.svg'
import AngleRight from '@hackernoon/pixel-icon-library/icons/SVG/regular/angle-right.svg'

import Select from '../select/index.vue'
import Input from '../input/index.vue'

import { useLocale } from '../share/util/locale'
import type { JSX } from 'vue/jsx-runtime'

defineOptions({
	name: 'Pagination'
})

const props = withDefaults(defineProps<PaginationProps>(), {
	total: 0,
	defaultPageSize: 10,
	pageSlot: 9,
	variant: 'ghost',
	showSize: false,
	showTotal: false,
	showJumper: false,
	simple: false,
	itemsOrder: () => ['total', 'page', 'size', 'jumper'],
	pageSizeOptions: () => [10, 20, 30, 40, 50, 100],
	size: 'medium',
	disabled: false,
	pollSizeChange: false,
	hideWhenSinglePage: false
})

const emits = defineEmits<PaginationEvents>()
const slots = useSlots()

const [t] = useLocale()

const allowOrderElements = ['total', 'page', 'size', 'jumper']
const itemsOrder = computed(() => {
	return unique(props.itemsOrder.filter((e) => allowOrderElements.includes(e)))
})

const [pageSize, updatePageSize] = useControlledMode('pageSize', props, emits, {
	defaultField: 'defaultPageSize',
	transform(arg: number | undefined | null) {
		return Math.max(arg || 10, 1)
	}
})

const pageCount = computed(() => {
	return pageSize.value ? Math.ceil(props.total / pageSize.value) : 0
})

const [page, updatePage, _] = useControlledMode('page', props, emits, {
	defaultField: 'defaultPage',
	transform(arg: number | undefined | null) {
		const nextValue = clamp(arg || BEGIN_PAGE, 1, pageCount.value)
		if ((arg || BEGIN_PAGE) !== nextValue) {
			emits('update:page', nextValue)
		}
		return nextValue
	}
}) as [Ref<number>, (nextValue: number | null | undefined) => Promise<void>, any]

watch(pageCount, () => {
	const nextPageValue = clamp(page.value, 1, pageCount.value)
	if (nextPageValue !== page.value) {
		updatePage(nextPageValue)
	}
})

const MIN_PAGE_SLOT_COUNT = 5

const pageSlot = computed(() => {
	return Math.max(props.pageSlot, MIN_PAGE_SLOT_COUNT)
})

const instance = getCurrentInstance()

const totalRender = () => {
	const tFn = t<Function>('pagination.total')
	const value = isFunction(tFn) ? tFn(props.total) : null
	const labelSlot = slots['total-label']
	const text = labelSlot ? labelSlot({ total: props.total }) : (props.totalLabel ?? value)
	return <div class="px-pagination-total">{text}</div>
}

const pageOptions = computed(() => {
	return generatePagination(page.value, pageCount.value, pageSlot.value)
})

const movePrevHandler = async (e: MouseEvent) => {
	if (props.disabled || page.value === BEGIN_PAGE) {
		return
	}
	const nextPage = Math.max(page.value - 1, 1)
	await updatePage(nextPage)
	emits('movePrev', nextPage, e)
	emits('pageChange', nextPage)
}

const movePostHandler = async (e: MouseEvent) => {
	if (props.disabled || page.value === pageCount.value || pageCount.value < 1) {
		return
	}
	const nextPage = Math.min(page.value + 1, pageCount.value)
	await updatePage(nextPage)
	emits('moveNext', nextPage, e)
	emits('pageChange', nextPage)
}

const buttonClickHandler = async (option: number | string, e: MouseEvent) => {
	if (props.disabled) {
		return
	}
	const ellipsisSpan = pageSlot.value - 2 - pageOptions.value.filter((e) => e === '...').length
	let nextPage =
		option === 'start-ellipsis'
			? page.value - ellipsisSpan
			: option === 'end-ellipsis'
				? page.value + ellipsisSpan
				: (option as number)
	await updatePage(nextPage)
	emits('pageSelect', nextPage, option, e)
	emits('pageChange', nextPage)
}

const commonPageRender = () => {
	const pageValue = page.value
	const buttons = pageOptions.value.map((e, i) => {
		if (isNumber(e)) {
			return (
				<div
					tabindex={props.disabled ? -1 : 0}
					class={{
						'px-pagination-page-item': true,
						'px-pagination-page-item__active': e === pageValue,
						'px-pagination-page-item__disabled': props.disabled
					}}
					key={e}
					onClick={(event) => buttonClickHandler(e, event)}
				>
					{e}
				</div>
			)
		} else {
			const key = i === 1 ? 'start-ellipsis' : 'end-ellipsis'
			return (
				<div
					tabindex={props.disabled ? -1 : 0}
					class={{
						'px-pagination-page-item': true,
						'px-pagination-page-item__disabled': props.disabled,
						'px-pagination-page-item__ellipsis': true
					}}
					key={i === 1 ? 'start-ellipsis' : 'end-ellipsis'}
					onClick={(event) => buttonClickHandler(key, event)}
				>
					{e}
				</div>
			)
		}
	})
	return buttons
}

const simpleControlInputValue = ref(page.value + '')
watch(page, (val) => {
	simpleControlInputValue.value = val + ''
})
const updateSimpleControlInputValue = (value: string) => {
	simpleControlInputValue.value = value
}
const doSimpleControlJump = async (e: Event) => {
	if (props.disabled) {
		return
	}

	const value = parseInt(simpleControlInputValue.value)

	if (isNanValue(value) || isInfinity(value)) {
		simpleControlInputValue.value = page.value + ''
		return
	}

	const nextPage = clamp(value, BEGIN_PAGE, pageCount.value)
	await updatePage(nextPage)
	simpleControlInputValue.value = page.value + ''
	emits('pageCommit', nextPage, e)
	emits('pageChange', nextPage)
}
const simpleControlBlurHandler = (e: FocusEvent) => {
	doSimpleControlJump(e)
}
const simpleControlKeydownHandler = (e: KeyboardEvent) => {
	if (e.key !== 'Enter') {
		return
	}
	doSimpleControlJump(e)
}
const simplePageRender = () => {
	return [
		<div class="px-pagination-page-simple-control">
			<Input
				class="px-pagination-input"
				// @ts-ignore
				onKeydown={simpleControlKeydownHandler}
				onBlur={simpleControlBlurHandler}
				modelValue={simpleControlInputValue.value}
				onUpdate:modelValue={updateSimpleControlInputValue}
				pollSizeChange={props.pollSizeChange}
				disabled={props.disabled}
			></Input>
			{` / ${pageCount.value}`}
		</div>
	]
}

const pageRender = (children: JSX.Element | JSX.Element[]) => {
	return (
		<div
			class={{
				'px-pagination-page': true,
				[`px-pagination-page__disabled`]: props.disabled,
				[`px-pagination-page__${props.variant}`]: props.variant
			}}
		>
			<div
				tabindex={props.disabled ? -1 : 0}
				key={'start-arrow'}
				class={{
					'px-pagination-page-item': true,
					'px-pagination-page-item__disabled': props.disabled || page.value === BEGIN_PAGE,
					'px-pagination-icon-wrapper': true
				}}
				onClick={movePrevHandler}
			>
				<AngleLeft></AngleLeft>
			</div>
			{children}
			<div
				tabindex={props.disabled ? -1 : 0}
				key={'end-arrow'}
				class={{
					'px-pagination-page-item': true,
					'px-pagination-page-item__disabled':
						props.disabled || page.value === pageCount.value || pageCount.value < 1,
					'px-pagination-icon-wrapper': true
				}}
				onClick={movePostHandler}
			>
				<AngleRight></AngleRight>
			</div>
		</div>
	)
}

const pageSizeOptions = computed(() => {
	return props.pageSizeOptions.map((e) => {
		if (isNumber(e)) {
			return {
				label: `${e}${t('pagination.perPage')}`,
				value: e
			}
		}
		return e
	})
})

const pageSizeSelectHandler = async (value: number) => {
	if (props.disabled) {
		return
	}
	await updatePageSize(value)
	emits('pageSizeChange', value)
}

const sizeRender = () => {
	return (
		<Select
			class={{
				'px-pagination-select': true
			}}
			options={pageSizeOptions.value}
			modelValue={pageSize.value}
			onSelect={pageSizeSelectHandler}
			pollSizeChange={props.pollSizeChange}
			disabled={props.disabled}
		></Select>
	)
}

const inputValue = ref('')
const updateInputValue = (value: string) => {
	inputValue.value = value
}
const doJump = async (e: Event) => {
	if (props.disabled) {
		return
	}
	const value = parseInt(inputValue.value)
	inputValue.value = ''

	if (isNanValue(value) || isInfinity(value)) {
		return
	}

	const page = clamp(value, BEGIN_PAGE, pageCount.value)
	await updatePage(page)
	emits('pageJump', page, e)
	emits('pageChange', page)
}
const blurHandler = (e: FocusEvent) => {
	doJump(e)
}
const keyDownHandler = (e: KeyboardEvent) => {
	if (e.key !== 'Enter') {
		return
	}
	doJump(e)
}

const jumperRender = () => {
	const labelSlot = slots['jumper-label']
	const text = labelSlot ? labelSlot() : (props.jumperLabel ?? t('pagination.goto'))
	return (
		<div class="px-pagination-jumper">
			<div class="px-pagination-jumper-label">{text}</div>
			<Input
				class="px-pagination-input"
				// @ts-ignore
				onKeydown={keyDownHandler}
				onBlur={blurHandler}
				modelValue={inputValue.value}
				onUpdate:modelValue={updateInputValue}
				pollSizeChange={props.pollSizeChange}
				disabled={props.disabled}
			></Input>
		</div>
	)
}

const hide = computed(() => {
	return props.hideWhenSinglePage && pageCount.value <= 1
})

const render = () => {
	return !hide.value ? (
		<div
			class={{
				pixelium: true,
				'px-pagination': true,
				[`px-pagination__${props.size}`]: props.size
			}}
		>
			{itemsOrder.value.map((token) => {
				switch (token) {
					case 'total': {
						return props.showTotal ? totalRender() : null
					}
					case 'page': {
						return pageRender(props.simple ? simplePageRender() : commonPageRender())
					}
					case 'size': {
						return props.showSize ? sizeRender() : null
					}
					case 'jumper': {
						return props.showJumper ? jumperRender() : null
					}
				}
			})}
		</div>
	) : null
}

defineRender(() => {
	return instance?.vnode.scopeId ? withScopeId(instance.vnode.scopeId)(render)() : render()
})
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
