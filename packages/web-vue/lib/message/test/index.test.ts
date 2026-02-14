import { describe, expect, it } from 'vitest'
import Message from '../index.vue'
import { mount } from '@vue/test-utils'
import { nextTick, Transition } from 'vue'

describe('Message component', () => {
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
			const wrapper = mount(Message, { props: { type: e as any } })
			await nextTick()
			expect(wrapper.findComponent(Transition).find('.px-message').classes()).include(
				`px-message__${e}`
			)
		}
	})
})
