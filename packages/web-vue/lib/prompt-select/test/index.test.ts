import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PromptSelect from '../index.vue'
import OptionList from '../../option-list/index.vue'
import { createMocks } from '../../share/util/test'

const selectOf = (wrapper: any) => wrapper.find('.px-prompt-select')

const options = [
	{ value: 'chat', label: 'Chat' },
	{ value: 'image', label: 'Image' }
]

const openList = async (wrapper: any) => {
	await selectOf(wrapper).trigger('click')
	await flushPromises()
	await nextTick()
	return wrapper.findComponent(OptionList)
}

describe('PromptSelect', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})

	it('shows the caret and never a clear icon', () => {
		const wrapper = mount(PromptSelect, { props: { label: 'Chat', options } })
		expect(wrapper.find('.px-prompt-select-caret').exists()).toBe(true)
		expect(wrapper.find('.px-prompt-select-close').exists()).toBe(false)
	})

	it('opens the option list on click and emits the selected value', async () => {
		const wrapper = mount(PromptSelect, {
			props: { label: 'Chat', options },
			attachTo: document.body
		})
		const optionList = await openList(wrapper)
		expect(optionList.exists()).toBe(true)

		const items = optionList.findAll('.px-option-list-item')
		expect(items.length).toBe(2)
		await items[1].trigger('click')
		await nextTick()

		expect(wrapper.emitted('select')?.[0]?.[0]).toBe('image')
		wrapper.unmount()
	})

	it('marks the option that matches the value through activeValues', async () => {
		const wrapper = mount(PromptSelect, {
			props: { label: 'Chat', value: 'image', options },
			attachTo: document.body
		})
		const optionList = await openList(wrapper)
		const activeItem = optionList.findAll('.px-option-list-item__active')
		expect(activeItem.length).toBe(1)
		expect(activeItem[0].text()).toBe('Image')
		wrapper.unmount()
	})
})
