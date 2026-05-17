import { describe, it, expect } from 'vitest'
import notification from '..'
import { nextTick } from 'vue'
import { wait } from 'parsnip-kit'

describe('notification function', () => {
	it('should render a string notification and return an id', async () => {
		const result = notification('Hello world')
		await nextTick()

		const el = document.querySelectorAll('.px-notification')
		expect(el.length).toBe(1)
		expect(el[0].textContent).toBe('Hello world')

		// @ts-ignore
		const key = el[0].__vueParentComponent.parent.parent.props.id

		expect(/^[a-zA-Z0-9_-]{21}$/.test(key)).toBe(true)

		expect(result).toHaveProperty('close')
		expect(result).toHaveProperty('clear')
		expect(result).toHaveProperty('unmount')

		result.unmount()
		await wait(100)
	})

	it('should render title and content correctly', async () => {
		const result = notification({
			content: 'Hello world',
			title: 'Title'
		})
		await nextTick()

		const el = document.querySelectorAll('.px-notification')
		expect(el.length).toBe(1)
		expect(el[0].querySelector('.px-notification-content')?.textContent).toBe('Hello world')
		expect(el[0].querySelector('.px-notification-title')?.textContent).toBe('Title')

		result.unmount()
		await wait(100)
	})

	it('should support shortcut methods with correct type', async () => {
		const infoRes = notification.info('Info notification')
		await nextTick()
		const infoMsgs = document.querySelectorAll('.px-notification__info')
		expect(infoMsgs.length).toBe(1)
		expect(infoMsgs[0].textContent).toBe('Info notification')

		const successRes = notification.success('Success')
		await nextTick()
		const successMsgs = document.querySelectorAll('.px-notification__success')
		expect(successMsgs.length).toBe(1)
		expect(successMsgs[0].textContent).toBe('Success')

		const warningRes = notification.warning('Warning')
		await nextTick()
		const warningMsgs = document.querySelectorAll('.px-notification__warning')
		expect(warningMsgs.length).toBe(1)
		expect(warningMsgs[0].textContent).toBe('Warning')

		const errorRes = notification.error('Error')
		await nextTick()
		const errorMsgs = document.querySelectorAll('.px-notification__error')
		expect(errorMsgs.length).toBe(1)
		expect(errorMsgs[0].textContent).toBe('Error')

		const noticeRes = notification.notice('Notice')
		await nextTick()
		const noticeMsgs = document.querySelectorAll('.px-notification__notice')
		expect(noticeMsgs.length).toBe(1)
		expect(noticeMsgs[0].textContent).toBe('Notice')

		const normalRes = notification.normal('Normal')
		await nextTick()
		const normalMsgs = document.querySelectorAll('.px-notification__normal')
		expect(normalMsgs.length).toBe(1)
		expect(normalMsgs[0].textContent).toBe('Normal')

		const loadingRes = notification.loading('Loading')
		await nextTick()
		const loadingMsgs = document.querySelectorAll('.px-notification__loading')
		expect(loadingMsgs.length).toBe(1)
		expect(loadingMsgs[0].textContent).toBe('Loading')

		for (const res of [
			infoRes,
			errorRes,
			successRes,
			warningRes,
			loadingRes,
			normalRes,
			noticeRes
		]) {
			expect(res).toHaveProperty('close')
			expect(res).toHaveProperty('clear')
			expect(res).toHaveProperty('unmount')
		}
		infoRes.unmount()
		await wait(100)
	})

	it('should close a specific notification when close() is called', async () => {
		const { close, unmount } = notification({ content: 'To be closed' })
		await nextTick()
		const msgs1 = document.querySelectorAll('.px-notification__normal')
		expect(msgs1.length).toBe(1)
		close()
		await wait(100)
		const msgs2 = document.querySelectorAll('.px-notification__normal')
		expect(msgs2.length).toBe(0)
		unmount()
	})

	it('should clear all notifications when clear() is called', async () => {
		const first = notification({ content: 'First' })
		notification({ content: 'Second' })
		await nextTick()

		expect(document.querySelectorAll('.px-notification__normal').length).toBe(2)

		first.clear()
		await wait(100)

		expect(document.querySelectorAll('.px-notification__normal').length).toBe(0)

		first.unmount()
		await wait(100)
	})

	it('should separate notifications by placement', async () => {
		const topResult = notification({ content: 'Top', placement: 'top-right' })
		const bottomResult = notification({ content: 'Bottom', placement: 'bottom-right' })
		await nextTick()

		expect(document.querySelectorAll('.px-notification__normal').length).toBe(2)

		bottomResult.close()
		await wait(100)

		expect(document.querySelectorAll('.px-notification__normal').length).toBe(1)
		expect(document.querySelectorAll('.px-notification__normal')[0].textContent).toBe('Top')

		// top still has its notification
		topResult.close()
		await wait(100)
		expect(document.querySelectorAll('.px-notification__normal').length).toBe(0)

		topResult.unmount()
		bottomResult.unmount()
		await wait(100)
	})

	it('should default placement to "top-right"', async () => {
		// If no placement specified, a top manager should be used
		const res = notification('default placement')
		await nextTick()
		const containers = document.querySelectorAll('.px-notification-box-container__top-right')
		expect(containers.length).toBe(1)
		const container = containers[0]
		const msgs = container.querySelectorAll('.px-notification')
		expect(msgs.length).toBe(1)
		expect(msgs[0].textContent).toBe('default placement')
		res.unmount()
		await wait(100)
	})

	it('should use custom root element', async () => {
		const customRoot = document.createElement('div')
		customRoot.id = 'custom-root'
		document.body.appendChild(customRoot)

		const res = notification({ content: 'Custom root', root: '#custom-root' })
		await nextTick()

		const elInRoot = document.querySelector('#custom-root .px-notification')
		expect(elInRoot).not.toBeNull()

		res.unmount()
		await wait(100)
		customRoot.remove()
		await wait(100)
	})

	it('should append wrapper to body when root is not found', async () => {
		const res = notification({ content: 'Fallback root', root: '#non-existent' })
		await nextTick()

		// The wrapper should be appended to body
		const el = document.body.querySelector('.px-notification')
		expect(el).not.toBeNull()

		res.unmount()
		await wait(100)
	})

	it('should return independent close for each notification call in the same placement', async () => {
		const res1 = notification({ content: 'msg1' })
		const res2 = notification({ content: 'msg2' })
		await nextTick()

		res1.close()
		await wait(100)
		expect(document.querySelectorAll('.px-notification').length).toBe(1)

		res2.close()
		await wait(100)
		expect(document.querySelectorAll('.px-notification').length).toBe(0)

		res1.unmount()
		await wait(100)
	})

	it('should handle multiple notifications in the same placement', async () => {
		notification({ content: 'a', placement: 'top-left' })
		notification({ content: 'b', placement: 'top-left' })
		notification({ content: 'c', placement: 'top-left' })
		await nextTick()

		expect(document.querySelectorAll('.px-notification').length).toBe(3)
	})
})
