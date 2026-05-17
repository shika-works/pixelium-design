import { describe, it, expect } from 'vitest'
import message from '..'
import { nextTick } from 'vue'
import { wait } from 'parsnip-kit'

describe('message function', () => {
	it('should render a string message and return an id', async () => {
		const result = message('Hello world')
		await nextTick()

		const el = document.querySelectorAll('.px-message')
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

	it('should support shortcut methods with correct type', async () => {
		const infoRes = message.info('Info message')
		await nextTick()
		const infoMsgs = document.querySelectorAll('.px-message__info')
		expect(infoMsgs.length).toBe(1)
		expect(infoMsgs[0].textContent).toBe('Info message')

		const successRes = message.success('Success')
		await nextTick()
		const successMsgs = document.querySelectorAll('.px-message__success')
		expect(successMsgs.length).toBe(1)
		expect(successMsgs[0].textContent).toBe('Success')

		const warningRes = message.warning('Warning')
		await nextTick()
		const warningMsgs = document.querySelectorAll('.px-message__warning')
		expect(warningMsgs.length).toBe(1)
		expect(warningMsgs[0].textContent).toBe('Warning')

		const errorRes = message.error('Error')
		await nextTick()
		const errorMsgs = document.querySelectorAll('.px-message__error')
		expect(errorMsgs.length).toBe(1)
		expect(errorMsgs[0].textContent).toBe('Error')

		const noticeRes = message.notice('Notice')
		await nextTick()
		const noticeMsgs = document.querySelectorAll('.px-message__notice')
		expect(noticeMsgs.length).toBe(1)
		expect(noticeMsgs[0].textContent).toBe('Notice')

		const normalRes = message.normal('Normal')
		await nextTick()
		const normalMsgs = document.querySelectorAll('.px-message__normal')
		expect(normalMsgs.length).toBe(1)
		expect(normalMsgs[0].textContent).toBe('Normal')

		const loadingRes = message.loading('Loading')
		await nextTick()
		const loadingMsgs = document.querySelectorAll('.px-message__loading')
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

	it('should close a specific message when close() is called', async () => {
		const { close, unmount } = message({ content: 'To be closed' })
		await nextTick()
		const msgs1 = document.querySelectorAll('.px-message__normal')
		expect(msgs1.length).toBe(1)
		close()
		await wait(100)
		const msgs2 = document.querySelectorAll('.px-message__normal')
		expect(msgs2.length).toBe(0)
		unmount()
	})

	it('should clear all messages when clear() is called', async () => {
		const first = message({ content: 'First' })
		message({ content: 'Second' })
		await nextTick()

		expect(document.querySelectorAll('.px-message__normal').length).toBe(2)

		first.clear()
		await wait(100)

		expect(document.querySelectorAll('.px-message__normal').length).toBe(0)

		first.unmount()
		await wait(100)
	})

	it('should separate messages by placement', async () => {
		const topResult = message({ content: 'Top', placement: 'top' })
		const bottomResult = message({ content: 'Bottom', placement: 'bottom' })
		await nextTick()

		expect(document.querySelectorAll('.px-message__normal').length).toBe(2)

		bottomResult.close()
		await wait(100)

		expect(document.querySelectorAll('.px-message__normal').length).toBe(1)
		expect(document.querySelectorAll('.px-message__normal')[0].textContent).toBe('Top')

		// top still has its message
		topResult.close()
		await wait(100)
		expect(document.querySelectorAll('.px-message__normal').length).toBe(0)

		topResult.unmount()
		bottomResult.unmount()
		await wait(100)
	})

	it('should default placement to "top"', async () => {
		// If no placement specified, a top manager should be used
		const res = message('default placement')
		await nextTick()
		const containers = document.querySelectorAll('.px-message-box-container__top')
		expect(containers.length).toBe(1)
		const container = containers[0]
		const msgs = container.querySelectorAll('.px-message')
		expect(msgs.length).toBe(1)
		expect(msgs[0].textContent).toBe('default placement')
		res.unmount()
		await wait(100)
	})

	it('should use custom root element', async () => {
		const customRoot = document.createElement('div')
		customRoot.id = 'custom-root'
		document.body.appendChild(customRoot)

		const res = message({ content: 'Custom root', root: '#custom-root' })
		await nextTick()

		const elInRoot = document.querySelector('#custom-root .px-message')
		expect(elInRoot).not.toBeNull()

		res.unmount()
		await wait(100)
		customRoot.remove()
		await wait(100)
	})

	it('should append wrapper to body when root is not found', async () => {
		const res = message({ content: 'Fallback root', root: '#non-existent' })
		await nextTick()

		// The wrapper should be appended to body
		const el = document.body.querySelector('.px-message')
		expect(el).not.toBeNull()

		res.unmount()
		await wait(100)
	})

	it('should return independent close for each message call in the same placement', async () => {
		const res1 = message({ content: 'msg1' })
		const res2 = message({ content: 'msg2' })
		await nextTick()

		res1.close()
		await wait(100)
		expect(document.querySelectorAll('.px-message').length).toBe(1)

		res2.close()
		await wait(100)
		expect(document.querySelectorAll('.px-message').length).toBe(0)

		res1.unmount()
		await wait(100)
	})

	it('should handle multiple messages in the same placement', async () => {
		message({ content: 'a', placement: 'top-left' })
		message({ content: 'b', placement: 'top-left' })
		message({ content: 'c', placement: 'top-left' })
		await nextTick()

		expect(document.querySelectorAll('.px-message').length).toBe(3)
	})
})
