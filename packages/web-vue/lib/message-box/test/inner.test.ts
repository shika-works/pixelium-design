import { mount } from '@vue/test-utils'
import { describe, it, expect, afterEach, beforeEach } from 'vitest'

import MessageBoxInner from '../message-box.vue'
import type { MessageProps } from '../../message/type'
import { createMocks } from '../../share/util/test'
import { nextTick } from 'vue'

function createMessages(overrides: Partial<MessageProps>[]): MessageProps[] {
	return overrides.map((item, index) => ({
		id: `msg-${index}`,
		content: `Content ${index}`,
		type: 'info' as const,
		...item
	}))
}

describe('MessageBoxInner', () => {
	const { pre, post } = createMocks()
	afterEach(() => {
		post()
	})
	beforeEach(() => {
		pre()
	})

	it('renders messages from the messages prop', () => {
		const messages = createMessages([{ content: 'Hello' }, { content: 'World' }])
		const wrapper = mount(MessageBoxInner, {
			props: { messages }
		})

		const messageComps = wrapper.findAllComponents({ name: 'MessageItem' })
		expect(messageComps).toHaveLength(2)
		expect(messageComps[0].props('content')).toBe('Hello')
		expect(messageComps[1].props('content')).toBe('World')
		wrapper.unmount()
	})

	it('applies container class based on placement prop', () => {
		const wrapper = mount(MessageBoxInner, {
			props: { messages: [], placement: 'bottom' }
		})
		const container = wrapper.find('.px-message-box-container')
		expect(container.classes()).toContain('px-message-box-container__bottom')
		wrapper.unmount()
	})

	it('applies container class based on position prop when placement is not set', () => {
		const wrapper1 = mount(MessageBoxInner, {
			props: { messages: [], position: 'top-left' }
		})
		const container1 = wrapper1.find('.px-message-box-container')
		expect(container1.classes()).toContain('px-message-box-container__top-left')

		wrapper1.unmount()

		const wrapper2 = mount(MessageBoxInner, {
			props: { messages: [], placement: 'top-left' }
		})
		const container2 = wrapper2.find('.px-message-box-container')
		expect(container2.classes()).toContain('px-message-box-container__top-left')

		wrapper2.unmount()
	})

	it('uses default zIndex from useZIndex', () => {
		const wrapper = mount(MessageBoxInner, {
			props: { messages: [] }
		})
		const box = wrapper.find('.px-message-box')
		expect(box.attributes('style')).toContain('z-index: 3001;')
		wrapper.unmount()
	})

	it('overrides zIndex with prop', () => {
		const wrapper = mount(MessageBoxInner, {
			props: { messages: [], zIndex: 9999 }
		})
		const box = wrapper.find('.px-message-box')
		expect(box.attributes('style')).toContain('z-index: 9999')
		wrapper.unmount()
	})

	it('handles message close event and updates messages', async () => {
		const messages = createMessages([
			{ id: '1', content: 'A' },
			{ id: '2', content: 'B' }
		])
		const wrapper = mount(MessageBoxInner, {
			props: { messages }
		})

		const firstMessage = wrapper.findAllComponents({ name: 'MessageItem' })[0]
		firstMessage.vm.$emit('close', '1')
		await nextTick()
		await nextTick()

		// Should emit the close event
		expect(wrapper.emitted('close')).toBeTruthy()
		expect(wrapper.emitted('close')![0]).toEqual(['1'])

		// Should emit update:messages with the remaining items
		const updateEvents = wrapper.emitted('update:messages')
		expect(updateEvents).toBeTruthy()
		const updatedArray = updateEvents![0][0] as any
		expect(updatedArray).toHaveLength(1)
		expect(updatedArray[0].id).toBe('2')
		wrapper.unmount()
	})

	it('does nothing if close is called with null/undefined id', async () => {
		const messages = createMessages([{ id: '1', content: 'A' }])
		const wrapper = mount(MessageBoxInner, {
			props: { messages }
		})
		const firstMessage = wrapper.findAllComponents({ name: 'MessageItem' })[0]
		await firstMessage.vm.$emit('close', null)

		expect(wrapper.emitted('update:messages')).toBeFalsy()
		wrapper.unmount()
	})

	it('exposes close method that calls child Message close', async () => {
		const messages = createMessages([{ id: '1', content: 'Test' }])
		const wrapper = mount(MessageBoxInner, {
			props: { messages }
		})

		wrapper.vm.close('1')
		await nextTick()
		const childMsg = wrapper.findComponent({ name: 'MessageItem' })
		expect(childMsg.element).toBeTruthy()
		expect(childMsg.find('.px-message').exists()).toBe(false)
		wrapper.unmount()
	})

	it('generates id with nanoid if message id is missing', async () => {
		const messages = [{ content: 'No ID' }]
		const wrapper = mount(MessageBoxInner, {
			props: { messages }
		})
		await nextTick()
		const msgComp = wrapper.findComponent({ name: 'MessageItem' })
		expect(/^[a-zA-Z0-9_-]{21}$/.test(msgComp.props('id'))).toBe(true)
		wrapper.unmount()
	})
})
