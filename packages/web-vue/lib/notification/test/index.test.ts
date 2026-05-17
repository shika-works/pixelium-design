import { describe, expect, it } from 'vitest'
import Notification from '../index.vue'
import { mount } from '@vue/test-utils'
import { nextTick, Transition } from 'vue'

describe('Notification component', () => {
	it('should render type correctly', async () => {
		const types = [
			'info',
			'success',
			'warning',
			'error',
			'sakura',
			'notice',
			'normal',
			'loading'
		]
		for (const e of types) {
			const wrapper = mount(Notification, { props: { type: e as any } })
			await nextTick()
			expect(wrapper.findComponent(Transition).find('.px-notification').classes()).include(
				`px-notification__${e}`
			)
		}
	})
	it('should render placement correctly', async () => {
		const placement = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
		for (const e of placement) {
			const wrapper = mount(Notification, { props: { type: e as any } })
			await nextTick()
			expect(wrapper.findComponent(Transition).find('.px-notification').classes()).include(
				`px-notification__${e}`
			)
		}
	})
})
