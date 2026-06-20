import { mount } from '@vue/test-utils'
import { describe, it, expect, afterEach, beforeEach } from 'vitest'

import NotificationBoxInner from '../notification-box.vue'
import type { NotificationProps } from '../../notification/type'
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

describe('NotificationBoxInner', () => {
	const { pre, post } = createMocks()
	afterEach(() => {
		post()
	})
	beforeEach(() => {
		pre()
	})

	it('renders notifications from the notifications prop', async () => {
		const notifications = createNotifications([
			{ content: 'Hello', title: 'Hello' },
			{ content: 'World', title: 'World' }
		])
		const wrapper = mount(NotificationBoxInner, {
			props: { notifications }
		})

		await nextTick()

		const notificationComps = wrapper.findAllComponents({ name: 'NotificationItem' })

		expect(notificationComps).toHaveLength(2)
		expect(notificationComps[0].props('content')).toBe('Hello')
		expect(notificationComps[1].props('content')).toBe('World')
		expect(notificationComps[0].props('title')).toBe('Hello')
		expect(notificationComps[1].props('title')).toBe('World')
		expect(notificationComps[0].find('.px-notification-main').text()).toBe('HelloHello')
		expect(notificationComps[1].find('.px-notification-main').text()).toBe('WorldWorld')
		wrapper.unmount()
	})

	it('applies container class based on placement prop', () => {
		const wrapper = mount(NotificationBoxInner, {
			props: { notifications: [], placement: 'bottom-left' }
		})
		const container = wrapper.find('.px-notification-box-container')
		expect(container.classes()).toContain('px-notification-box-container__bottom-left')
		wrapper.unmount()
	})

	it('applies container class based on position prop when placement is not set', () => {
		const wrapper = mount(NotificationBoxInner, {
			props: { notifications: [], placement: 'top-left' }
		})
		const container = wrapper.find('.px-notification-box-container')
		expect(container.classes()).toContain('px-notification-box-container__top-left')

		wrapper.unmount()
	})

	it('uses default zIndex from useZIndex', () => {
		const wrapper = mount(NotificationBoxInner, {
			props: { notifications: [] }
		})
		const box = wrapper.find('.px-notification-box')
		expect(box.attributes('style')).toContain('z-index: 3001;')
		wrapper.unmount()
	})

	it('overrides zIndex with prop', () => {
		const wrapper = mount(NotificationBoxInner, {
			props: { notifications: [], zIndex: 9999 }
		})
		const box = wrapper.find('.px-notification-box')
		expect(box.attributes('style')).toContain('z-index: 9999')
		wrapper.unmount()
	})

	it('handles notification close event and updates notifications', async () => {
		const notifications = createNotifications([
			{ id: '1', content: 'A' },
			{ id: '2', content: 'B' }
		])
		const wrapper = mount(NotificationBoxInner, {
			props: { notifications }
		})

		const firstNotification = wrapper.findAllComponents({ name: 'NotificationItem' })[0]
		firstNotification.vm.$emit('close', '1')
		await nextTick()
		await nextTick()

		// Should emit the close event
		expect(wrapper.emitted('close')).toBeTruthy()
		expect(wrapper.emitted('close')![0]).toEqual(['1'])

		// Should emit update:notifications with the remaining items
		const updateEvents = wrapper.emitted('update:notifications')
		expect(updateEvents).toBeTruthy()
		const updatedArray = updateEvents![0][0] as any
		expect(updatedArray).toHaveLength(1)
		expect(updatedArray[0].id).toBe('2')
		wrapper.unmount()
	})

	it('does nothing if close is called with null/undefined id', async () => {
		const notifications = createNotifications([{ id: '1', content: 'A' }])
		const wrapper = mount(NotificationBoxInner, {
			props: { notifications }
		})
		const firstNotification = wrapper.findAllComponents({ name: 'NotificationItem' })[0]
		await firstNotification.vm.$emit('close', null)

		expect(wrapper.emitted('update:notifications')).toBeFalsy()
		wrapper.unmount()
	})

	it('exposes close method that calls child Notification close', async () => {
		const notifications = createNotifications([{ id: '1', content: 'Test' }])
		const wrapper = mount(NotificationBoxInner, {
			props: { notifications }
		})

		wrapper.vm.close('1')
		await nextTick()
		const childMsg = wrapper.findComponent({ name: 'NotificationItem' })
		expect(childMsg.element).toBeTruthy()
		expect(childMsg.find('.px-notification').exists()).toBe(false)
		wrapper.unmount()
	})

	it('generates id with nanoid if notification id is missing', async () => {
		const notifications = [{ content: 'No ID' }]
		const wrapper = mount(NotificationBoxInner, {
			props: { notifications }
		})
		await nextTick()
		const msgComp = wrapper.findComponent({ name: 'NotificationItem' })
		expect(/^[a-zA-Z0-9_-]{21}$/.test(msgComp.props('id'))).toBe(true)
		wrapper.unmount()
	})
})
