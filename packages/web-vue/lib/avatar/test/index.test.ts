import { mount } from '@vue/test-utils'
import Avatar from '../index.vue'
import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { createMocks } from '../../share/util/test'
import { h } from 'vue'

describe('Avatar', () => {
	const { pre, post } = createMocks()

	afterEach(() => {
		post()
	})
	beforeEach(() => {
		pre()
	})

	it('renders slot content when provided', () => {
		const wrapper = mount(Avatar, {
			slots: {
				default: () => h('span', { class: 'custom' }, ['A'])
			}
		})
		expect(wrapper.html()).toContain('<span class="custom">A</span>')
	})

	it('applies size prop correctly', () => {
		const wrapper = mount(Avatar, {
			props: { size: 'large' }
		})
		expect(wrapper.classes().join(' ')).toMatch(/large/)
	})

	it('applies shape prop correctly', () => {
		const wrapper = mount(Avatar, {
			props: { shape: 'square' }
		})
		expect(wrapper.classes().join(' ')).toMatch(/square/)
	})
})
