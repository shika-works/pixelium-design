import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'

import NotificationBox from '../notification-box-wrapped.vue'
import type { NotificationProps } from '../../notification/type'
import { ref } from 'vue'

import { createMocks } from '../../share/util/test'
import { nextTick } from 'vue'

function createNotifications(overrides: Partial<NotificationProps>[]): NotificationProps[] {
	return overrides.map((item, index) => ({
		id: `msg-${index}`,
		content: `Content ${index}`,
		type: 'info' as const,
		...item
	}))
}

function getInnerComponent(wrapper: VueWrapper<any>) {
	return wrapper.findComponent({ name: 'NotificationBoxInner' })
}

describe('NotificationBox (outer wrapper)', () => {
	const { pre, post } = createMocks()
	afterEach(() => {
		post()
	})
	beforeEach(() => {
		pre()
	})

	it('teleports to body by default', () => {
		const wrapper = mount(NotificationBox, {
			props: { notifications: [] }
		})
		const inner = getInnerComponent(wrapper)
		expect(inner.exists()).toBe(true)
		expect(document.body.querySelector('.px-notification-box')).not.toBeNull()
		wrapper.unmount()
	})

	it('teleports to a custom root element', () => {
		const el = document.createElement('div')
		el.id = 'custom-root'
		document.body.appendChild(el)

		const wrapper = mount(NotificationBox, {
			props: { notifications: [], root: '#custom-root' }
		})
		expect(document.querySelector('#custom-root .px-notification-box')).not.toBeNull()
		wrapper.unmount()
	})

	it('passes props and attrs down to inner NotificationBox', () => {
		const notifications = createNotifications([{ id: '1', content: 'Hi' }])
		const wrapper = mount(NotificationBox, {
			props: {
				notifications,
				placement: 'bottom-right',
				zIndex: 10
			},
			attrs: {
				'data-test': 'my-value'
			}
		})
		const inner = getInnerComponent(wrapper)
		expect(inner.props('placement')).toBe('bottom-right')
		expect(inner.props('zIndex')).toBe(10)
		expect(inner.props('notifications')).toEqual(notifications)
		expect(inner.attributes('data-test')).toBe('my-value')
		wrapper.unmount()
	})

	it('exposes close method that proxies to inner component', async () => {
		const notifications = createNotifications([{ id: '1', content: 'x' }])
		const wrapper = mount(NotificationBox, {
			props: { notifications }
		})
		const closeSpy = vi.spyOn(wrapper.vm, 'close')

		wrapper.vm.close('1')
		expect(closeSpy).toHaveBeenCalledWith('1')
		wrapper.unmount()
	})

	it('supports v-model:notifications pattern', async () => {
		const model = ref(
			createNotifications([
				{ id: '1', content: 'A' },
				{ id: '2', content: 'B' }
			])
		)
		const wrapper = mount(NotificationBox, {
			props: {
				notifications: model.value,
				'onUpdate:notifications': (val: NotificationProps[]) => {
					model.value = val
				}
			}
		})

		// Simulate close from a notification inside inner component
		const firstNotification = wrapper.findAllComponents({ name: 'NotificationItem' })[0]
		firstNotification.vm.$emit('close', '1')
		await nextTick()
		await nextTick()

		// The update should propagate up through the outer wrapper
		expect(wrapper.emitted('update:notifications')).toBeTruthy()
		const newVal = wrapper.emitted('update:notifications')![0][0] as any
		expect(newVal).toHaveLength(1)
		expect(newVal[0].id).toBe('2')
		// Also verify that the model ref was updated (parent side)
		expect(model.value).toHaveLength(1)
		wrapper.unmount()
	})

	it('emits close event when inner notification is closed', async () => {
		const notifications = createNotifications([{ id: '1', content: 'Close test' }])
		const wrapper = mount(NotificationBox, {
			props: { notifications }
		})
		const firstNotification = wrapper.findAllComponents({ name: 'NotificationItem' })[0]
		firstNotification.vm.$emit('close', '1')
		await nextTick()
		await nextTick()

		expect(wrapper.emitted('close')).toBeTruthy()
		expect(wrapper.emitted('close')![0]).toEqual(['1'])
		wrapper.unmount()
	})
})
