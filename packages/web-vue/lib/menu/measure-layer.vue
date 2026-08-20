<script setup lang="tsx">
import { inject, provide, useSlots, type CSSProperties } from 'vue'
import { MENU_PROVIDE } from '../share/const/provide-key'
import type { MenuProvide } from './type'

defineOptions({
	name: 'MeasureLayer'
})

const props = defineProps<{
	classes: string[]
}>()

const slots = useSlots()
const realProvide = inject<MenuProvide | undefined>(MENU_PROVIDE, undefined)
if (realProvide) {
	provide(MENU_PROVIDE, {
		...realProvide,
		updateRender: () => {}
	})
}

const MEASURE_LAYER_STYLE: CSSProperties = {
	position: 'absolute',
	top: '-9999px',
	left: '-9999px',
	width: '0',
	height: '0',
	overflow: 'hidden',
	visibility: 'hidden',
	pointerEvents: 'none',
	zIndex: '-1'
}

defineRender(() => {
	return (
		<div class="px-menu-measure-layer" aria-hidden="true" style={MEASURE_LAYER_STYLE}>
			<ul class={props.classes} style={{ width: '99999px' }}>
				{slots.default?.()}
			</ul>
		</div>
	)
})
</script>
