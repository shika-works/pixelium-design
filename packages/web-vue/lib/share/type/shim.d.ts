import type { VNodeChild } from 'vue'
import type { JSX } from 'vue/jsx-runtime'

declare global {
	function defineRender(render: JSX.Element | (() => JSX.Element | VNodeChild)): void
}
