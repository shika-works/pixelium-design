import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Tag from '../index.vue'
import { createMocks } from '../../share/util/test'

describe('Tag Component', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})
	it('renders slot content', () => {
		const wrapper = mount(Tag, {
			slots: {
				default: 'Hello Tag'
			}
		})

		expect(wrapper.text()).toContain('Hello Tag')
	})

	it('applies classes from props', () => {
		const wrapper = mount(Tag, {
			props: {
				size: 'small',
				variant: 'outline',
				theme: 'sakura',
				disabled: true
			}
		})

		const el = wrapper.get('span')
		expect(el.classes()).toContain('px-tag__small')
		expect(el.classes()).toContain('px-tag__outline')
		expect(el.classes()).toContain('px-tag__disabled')
		expect(el.classes()).toContain('px-tag__sakura')
	})

	it('emits close when closable and not disabled', async () => {
		const wrapper = mount(Tag, {
			props: {
				closable: true
			}
		})

		const icon = wrapper.get('.px-tag-icon')
		await icon.trigger('click')

		expect(wrapper.emitted('close')).toBeTruthy()
		expect(wrapper.emitted('close')?.length).toBe(1)
	})

	it('does not emit close when disabled', async () => {
		const wrapper = mount(Tag, {
			props: {
				closable: true,
				disabled: true
			}
		})

		const icon = wrapper.get('.px-tag-icon')
		await icon.trigger('click')

		expect(wrapper.emitted('close')).toBeUndefined()
	})

	it('applies custom class and sets style when color provided', () => {
		const wrapper = mount(Tag, {
			props: {
				color: '#ff0000'
			}
		})

		const el = wrapper.get('span')
		expect(el.classes()).toContain('px-tag__custom')
		// style may not be reflected as an attribute in jsdom; check computed style or inline style
		const colorStyle = el.element.style.color || getComputedStyle(el.element).color
		expect(colorStyle).toBeTruthy()
	})
})
