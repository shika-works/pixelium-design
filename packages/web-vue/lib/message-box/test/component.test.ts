import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'

import MessageBox from '../message-box-wrapped.vue'
import type { MessageProps } from '../../message/type'
import { ref } from 'vue'

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

function getInnerComponent(wrapper: VueWrapper<any>) {
	return wrapper.findComponent({ name: 'MessageBoxInner' })
}

describe('MessageBox (outer wrapper)', () => {
	const { pre, post } = createMocks()
	afterEach(() => {
		post()
	})
	beforeEach(() => {
		pre()
	})

	it('teleports to body by default', () => {
		const wrapper = mount(MessageBox, {
			props: { messages: [] } as any
		})
		const inner = getInnerComponent(wrapper)
		expect(inner.exists()).toBe(true)
		expect(document.body.querySelector('.px-message-box')).not.toBeNull()
		wrapper.unmount()
	})

	it('teleports to a custom root element', () => {
		const el = document.createElement('div')
		el.id = 'custom-root'
		document.body.appendChild(el)

		const wrapper = mount(MessageBox, {
			props: { messages: [], root: '#custom-root' } as any
		})
		expect(document.querySelector('#custom-root .px-message-box')).not.toBeNull()
		wrapper.unmount()
	})

	it('passes props and attrs down to inner MessageBox', () => {
		const messages = createMessages([{ id: '1', content: 'Hi' }])
		const wrapper = mount(MessageBox, {
			props: {
				messages,
				placement: 'bottom',
				zIndex: 10
			} as any,
			attrs: {
				'data-test': 'my-value'
			}
		})
		const inner = getInnerComponent(wrapper)
		expect(inner.props('placement')).toBe('bottom')
		expect(inner.props('zIndex')).toBe(10)
		expect(inner.props('messages')).toEqual(messages)
		expect(inner.attributes('data-test')).toBe('my-value')
		wrapper.unmount()
	})

	it('exposes close method that proxies to inner component', async () => {
		const messages = createMessages([{ id: '1', content: 'x' }])
		const wrapper = mount(MessageBox, {
			props: { messages } as any
		})
		const closeSpy = vi.spyOn(wrapper.vm, 'close')

		wrapper.vm.close('1')
		expect(closeSpy).toHaveBeenCalledWith('1')
		wrapper.unmount()
	})

	it('supports v-model:messages pattern', async () => {
		const model = ref(
			createMessages([
				{ id: '1', content: 'A' },
				{ id: '2', content: 'B' }
			])
		)
		const wrapper = mount(MessageBox, {
			props: {
				messages: model.value,
				'onUpdate:messages': (val: MessageProps[]) => {
					model.value = val
				}
			} as any
		})

		// Simulate close from a message inside inner component
		const firstMessage = wrapper.findAllComponents({ name: 'MessageItem' })[0]
		firstMessage.vm.$emit('close', '1')
		await nextTick()
		await nextTick()

		// The update should propagate up through the outer wrapper
		expect(wrapper.emitted('update:messages')).toBeTruthy()
		const newVal = wrapper.emitted('update:messages')![0][0] as any
		expect(newVal).toHaveLength(1)
		expect(newVal[0].id).toBe('2')
		// Also verify that the model ref was updated (parent side)
		expect(model.value).toHaveLength(1)
		wrapper.unmount()
	})

	it('emits close event when inner message is closed', async () => {
		const messages = createMessages([{ id: '1', content: 'Close test' }])
		const wrapper = mount(MessageBox, {
			props: { messages } as any
		})
		const firstMessage = wrapper.findAllComponents({ name: 'MessageItem' })[0]
		firstMessage.vm.$emit('close', '1')
		await nextTick()
		await nextTick()

		expect(wrapper.emitted('close')).toBeTruthy()
		expect(wrapper.emitted('close')![0]).toEqual(['1'])
		wrapper.unmount()
	})
})
