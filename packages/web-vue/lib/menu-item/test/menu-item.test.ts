import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Menu from '../../menu/index.vue'
import MenuItem from '../index.vue'
import { createMocks } from '../../share/util/test'
import { nextTick } from 'vue'

describe('MenuItem Component', () => {
	const { pre, post } = createMocks()
	beforeEach(() => pre())
	afterEach(() => post())

	it('does not emit select when disabled', async () => {
		const wrapper = mount({
			components: { Menu, MenuItem },
			template: `
				<Menu>
					<MenuItem index="1" label="Disabled" :disabled="true" />
				</Menu>
			`
		})

		await nextTick()

		const li = wrapper.find('.px-menu-item')
		await li.trigger('click')

		expect(wrapper.emitted('select')).toBeFalsy()
	})

	it('renders icon slot wrapper when icon slot provided', async () => {
		const wrapper = mount({
			components: { Menu, MenuItem },
			template: `
				<Menu>
					<MenuItem index="1">
						<template #icon> <span class="icon">I</span> </template>
						Label
					</MenuItem>
				</Menu>
			`
		})

		await nextTick()

		expect(wrapper.find('.px-menu-item-icon-wrapper').exists()).toBe(true)
	})
})
