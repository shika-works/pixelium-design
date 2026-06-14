<script setup lang="tsx">
import {
	computed,
	getCurrentInstance,
	nextTick,
	provide,
	ref,
	shallowRef,
	toRef,
	useAttrs,
	useSlots,
	watch,
	withScopeId,
	type VNode
} from 'vue'
import { type TabEvents, type TabProps, type TabProvide } from './type'
import { TAB_PROVIDE } from '../share/const/provide-key'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import ScrollBar from '../scroll-bar/index.vue'
import { flattenVNodes } from '../share/util/render'
import TabItem from '../tab-item/index.vue'
import { isEqual, isNumber, isObjectLike } from 'parsnip-kit'
import Add from '@hackernoon/pixel-icon-library/icons/SVG/regular/plus.svg'
import IconWrapper from '../icon-wrapper/index.vue'
defineOptions({
	name: 'Tab'
})

const props = withDefaults(defineProps<TabProps>(), {
	placement: 'top',
	justify: 'start',
	variant: 'line',
	tabMaxWidth: 160,
	tabMinWidth: 60
})

const emits = defineEmits<TabEvents>()

const [active, updateActive] = useControlledMode('active', props, emits, {
	defaultField: 'defaultActive'
})

async function selectHandler(key: number | string | symbol, event: MouseEvent) {
	await updateActive(key)
	emits('select', key, event)
}

function closeHandler(index: number | string | symbol, event: MouseEvent) {
	emits('close', index, event)
}

const scrollBarRef = shallowRef<null | InstanceType<typeof ScrollBar>>(null)
async function createHandler(event: MouseEvent) {
	try {
		await props.onCreate?.(event)
	} finally {
		if (props.justify === 'end') {
			scrollBarRef.value?.scrollTo({
				left: scrollBarRef.value.scrollWidth,
				top: scrollBarRef.value.scrollHeight
			})
		}
	}
}

const scrollInitializeHandler = () => {
	if (props.justify === 'end') {
		nextTick(() => {
			scrollBarRef.value?.scrollTo({
				left: scrollBarRef.value.scrollWidth,
				top: scrollBarRef.value.scrollHeight
			})
		})
	}
}

const slots = useSlots()

const hasPrefix = computed(() => {
	return !!slots.prefix
})

const hasSuffix = computed(() => {
	return !!slots.suffix
})

const isHorizontal = computed(() => {
	return ['left', 'right'].includes(props.placement as any)
})

const tabMaxWidth = computed(() => {
	if (!isHorizontal.value) {
		return 'none'
	}
	return isNumber(props.tabMaxWidth) ? `${props.tabMaxWidth}px` : props.tabMaxWidth
})
const tabMinWidth = computed(() => {
	if (!isHorizontal.value) {
		return 'none'
	}
	return isNumber(props.tabMinWidth) ? `${props.tabMinWidth}px` : props.tabMinWidth
})

const totalTabCount = ref(0)
const lastTab = computed(() => validTabIdxList.value.length <= 1)
const noneTab = computed(() => totalTabCount.value === 0)

provide<TabProvide>(TAB_PROVIDE, {
	active,
	variant: toRef(props, 'variant'),
	closeHandler,
	selectHandler,
	hasPrefix,
	hasSuffix,
	justify: toRef(props, 'justify'),
	creatable: toRef(props, 'creatable'),
	placement: toRef(props, 'placement'),
	tabMaxWidth,
	tabMinWidth,
	isHorizontal,
	pollSizeChange: toRef(props, 'pollSizeChange'),
	lastTab
})

const renderHeaderTabs = (tabItems: VNode[]) => {
	return (
		<div
			class={['px-tab-header-wrapper', noneTab.value && 'px-tab-header-wrapper__none-tab']}
			style={{
				maxWidth: tabMaxWidth.value,
				minWidth: tabMinWidth.value
			}}
		>
			{slots.prefix && (
				<div
					style={{
						maxWidth: tabMaxWidth.value,
						minWidth: tabMinWidth.value
					}}
					class={{
						'px-tab-prefix': true,
						'px-word-wrap': isHorizontal.value
					}}
				>
					{slots.prefix()}
				</div>
			)}
			<ScrollBar
				ref={scrollBarRef}
				class="px-tab-header-scroll"
				showScrollPadding={false}
				visible={false}
				edgeMask
				onInitialize={scrollInitializeHandler}
			>
				<div
					class={{
						'px-tab-header': true,
						[`px-tab-header__${props.justify}`]: true
					}}
				>
					{tabItems}
				</div>
			</ScrollBar>
			{props.creatable && renderAddTab()}
			{slots.suffix && (
				<div
					style={{
						maxWidth: tabMaxWidth.value,
						minWidth: tabMinWidth.value
					}}
					class={{
						'px-tab-suffix': true,
						'px-word-wrap': ['left', 'right'].includes(props.placement as any)
					}}
				>
					{slots.suffix()}
				</div>
			)}
		</div>
	)
}

const renderAddTab = () => {
	return (
		<div class="px-tab-add-tab">
			<IconWrapper
				// @ts-ignore
				onClick={createHandler}
				color="var(--px-neutral-8)"
				press-color="var(--px-primary-7)"
				hover-color="var(--px-primary-5)"
			>
				<Add></Add>
			</IconWrapper>
		</div>
	)
}

const validTabIdxList = ref<(number | string | symbol)[]>([])

watch(
	validTabIdxList,
	(val, old) => {
		if (!isEqual(val, old) && val.length > 0) {
			if (!active.value || !val.includes(active.value)) {
				const nextActive = val[0]
				updateActive(nextActive)
			}
		}
	},
	{
		deep: true
	}
)

const instance = getCurrentInstance()
const attrs = useAttrs()

const render = () => {
	const children = flattenVNodes(slots.default?.()) || []

	const tabPanels = children.filter((e) => {
		const type = e.type
		return isObjectLike(type) && 'name' in type && type.name === 'TabPanel'
	})
	const tabItems = children.filter((e) => {
		const type = e.type
		return isObjectLike(type) && 'name' in type && type.name === 'TabItem'
	}) as VNode[]
	tabPanels.forEach((e) => {
		tabItems.push(
			(
				<TabItem {...(e.props as any)} key={e.props?.index}>
					{{
						title: (e.children as any)?.title,
						icon: (e.children as any)?.icon
					}}
				</TabItem>
			) as VNode
		)
	})
	totalTabCount.value = tabItems.length
	validTabIdxList.value = tabItems
		.filter((e) => {
			return e.props ? e.props.disabled !== '' && !e.props.disabled : true
		})
		.map((e) => e.props?.index)

	return (
		<div
			class={['pixelium', 'px-tab', `px-tab__${props.placement}`, `px-tab__${props.variant}`]}
			{...attrs}
		>
			{props.placement === 'top' || props.placement === 'left'
				? [renderHeaderTabs(tabItems), tabPanels]
				: [tabPanels, renderHeaderTabs(tabItems)]}
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
