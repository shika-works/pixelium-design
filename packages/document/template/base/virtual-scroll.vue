<script lang="ts">
import { ref, h, defineComponent } from 'vue'
import { VirtualList, Scroll } from '@pixelium/web-vue'
import type { JSX } from 'vue/jsx-runtime'

export default defineComponent({
	setup() {
		const list = ref(
			Array.from({ length: 10000 })
				.fill(0)
				.map((_, index) => ({
					render: () =>
						h('div', { style: `height: ${20 + index / 100}px;` }, [`Item #${index}`])
				}))
		)
		return () =>
			h(
				VirtualList,
				{
					list: list.value,
					estimatedHeight: 20,
					style: 'height: 500px'
				},
				{
					'scroll-container': ({
						children,
						onScroll
					}: {
						children: JSX.Element
						onScroll: (event: Event) => void
					}) =>
						h(
							Scroll,
							{ style: 'height: 500px', onScroll: onScroll },
							{
								default: () => children
							}
						)
				}
			)
	}
})
</script>
