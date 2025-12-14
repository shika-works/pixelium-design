<script setup lang="tsx">
import { computed, Fragment, useSlots } from 'vue'
import type { SpaceProps } from './type'
import { flattenVNodes } from '../share/util/render'
import { isNumber } from 'parsnip-kit'

defineOptions({
	name: 'Space'
})

const props = withDefaults(defineProps<SpaceProps>(), {
	margin: 'medium',
	wrap: true,
	justify: 'start',
	inline: false,
	direction: 'horizontal'
})

const alignComputed = computed(() => {
	if (props.align) {
		return props.align
	}
	return props.direction === 'horizontal' ? 'center' : 'stretch'
})

const slots = useSlots()

const marginComputed = computed(() => {
	if (
		!props.margin ||
		props.margin === 'small' ||
		props.margin === 'medium' ||
		props.margin === 'large'
	) {
		return
	}
	if (isNumber(props.margin)) {
		return {
			x: props.margin,
			y: props.margin
		}
	}
	if ('x' in props.margin || 'y' in props.margin) {
		const x = isNumber(props.margin.x) ? props.margin.x : 0
		const y = isNumber(props.margin.y) ? props.margin.y : 0
		return { x, y }
	}
})

defineRender(() => {
	const children = flattenVNodes(slots.default?.() || [])
	return (
		<div
			class={{
				pixelium: true,
				'px-space': true,
				[`px-space__inline`]: !!props.inline
			}}
		>
			<div
				class={{
					'px-space-inner': true,
					[`px-space__small`]: props.margin === 'small',
					[`px-space__large`]: props.margin === 'large',
					[`px-space__justify-${props.justify}`]: true,
					[`px-space__align-${alignComputed.value}`]: true,
					[`px-space__${props.direction}`]: true,
					[`px-space__wrap`]: !!props.wrap
				}}
				style={{
					marginTop: marginComputed.value ? -marginComputed.value.y / 2 + 'px' : undefined,
					marginBottom: marginComputed.value ? -marginComputed.value.y / 2 + 'px' : undefined,
					marginLeft: marginComputed.value ? -marginComputed.value.x / 2 + 'px' : undefined,
					marginRight: marginComputed.value ? -marginComputed.value.x / 2 + 'px' : undefined
				}}
			>
				{children.map((child, index) => (
					<Fragment key={child.key || `px-space-item-${index}`}>
						<div
							class="px-space-item"
							style={{
								marginTop: marginComputed.value ? marginComputed.value.y / 2 + 'px' : undefined,
								marginBottom: marginComputed.value
									? marginComputed.value.y / 2 + 'px'
									: undefined,
								marginLeft: marginComputed.value
									? marginComputed.value.x / 2 + 'px'
									: undefined,
								marginRight: marginComputed.value
									? marginComputed.value.x / 2 + 'px'
									: undefined
							}}
						>
							{child}
						</div>
					</Fragment>
				))}
			</div>
		</div>
	)
})
</script>

<style lang="less" src="./index.less"></style>

<style lang="less" src="../share/style/index.css" />
