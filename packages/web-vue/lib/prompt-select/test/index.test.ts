import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { computed, nextTick, ref } from 'vue'
import type { Ref } from 'vue'
import PromptSelect from '../index.vue'
import OptionList from '../../option-list/index.vue'
import Popup from '../../popup/index.vue'
import { createMocks } from '../../share/util/test'
import { PROMPT_PROVIDE } from '../../share/const/provide-key'
import type { PromptProvide } from '../../prompt/type'

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

const promptProvide = (disabled: Ref<boolean>) =>
	({
		disabled: computed(() => disabled.value),
		readonly: computed(() => false)
	}) as unknown as PromptProvide

const mountSelect = (options: { props?: Record<string, any>; disabled?: Ref<boolean> } = {}) =>
	mount(PromptSelect, {
		props: options.props ?? {},
		attachTo: document.body,
		global: {
			provide: {
				[PROMPT_PROVIDE]: promptProvide(options.disabled ?? ref(true))
			}
		}
	})

describe('PromptSelect', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})

	it('shows the caret and never a clear icon', () => {
		const wrapper = mount(PromptSelect, { props: { modelValue: 'chat', options } })
		expect(wrapper.find('.px-prompt-select').text()).toBe('Chat')
		expect(wrapper.find('.px-prompt-select-caret').exists()).toBe(true)
		expect(wrapper.find('.px-prompt-select-close').exists()).toBe(false)
	})

	it('opens the option list on click and emits the selected value', async () => {
		const wrapper = mount(PromptSelect, {
			props: { modelValue: 'chat', options },
			attachTo: document.body
		})
		const optionList = await openList(wrapper)
		expect(optionList.exists()).toBe(true)

		const items = optionList.findAll('.px-option-list-item')
		expect(items.length).toBe(2)
		await items[1].trigger('click')
		await nextTick()

		expect(wrapper.emitted('select')?.[0]?.[0]).toBe('image')
		expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('image')
		wrapper.unmount()
	})

	it('marks the option that matches the value through activeValues', async () => {
		const wrapper = mount(PromptSelect, {
			props: { modelValue: 'image', options },
			attachTo: document.body
		})
		const optionList = await openList(wrapper)
		const activeItem = optionList.findAll('.px-option-list-item__active')
		expect(activeItem.length).toBe(1)
		expect(activeItem[0].text()).toBe('Image')
		wrapper.unmount()
	})

	it('inherits the disabled state from the prompt context', async () => {
		const wrapper = mountSelect({ props: { modelValue: 'chat', options } })
		expect(selectOf(wrapper).attributes('disabled')).toBeDefined()

		await selectOf(wrapper).trigger('click')
		await flushPromises()
		expect(wrapper.findComponent(Popup).props('visible')).toBe(false)
		wrapper.unmount()
	})

	it('does not open through the exposed open while disabled', async () => {
		const wrapper = mountSelect({ props: { modelValue: 'chat', options } })
		const vm = wrapper.vm as unknown as { open: () => void }
		vm.open()
		await nextTick()
		await flushPromises()
		expect(wrapper.findComponent(Popup).props('visible')).toBe(false)
		wrapper.unmount()
	})

	it('closes the open list when the prompt becomes disabled', async () => {
		const disabled = ref(false)
		const wrapper = mountSelect({
			props: { modelValue: 'chat', options },
			disabled
		})
		await openList(wrapper)
		expect(wrapper.findComponent(Popup).props('visible')).toBe(true)

		disabled.value = true
		await nextTick()
		await flushPromises()
		expect(wrapper.findComponent(Popup).props('visible')).toBe(false)
		wrapper.unmount()
	})
})
