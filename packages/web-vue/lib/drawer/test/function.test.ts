import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMocks } from '../../share/util/test.ts'
import Drawer from '../index.ts'
import { nextTick } from 'vue'

describe('Drawer functional calls (index.ts)', () => {
	const UNMOUNT_DELAY = 250 + 150
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
		vi.useFakeTimers()
	})

	afterEach(async () => {
		try {
			await vi.advanceTimersByTimeAsync(1000)
		} catch {
			// ignore
		}
		// remove any leftover drawer wrappers
		document.querySelectorAll('.px-drawer-wrapper').forEach((el) => el.remove())
		vi.useRealTimers()
		post()
	})

	it('static function exited', () => {
		expect('open' in Drawer).toBe(true)
	})

	it('calling close removes container', async () => {
		const rtn = Drawer.open('close test')
		await nextTick()

		const container = document.querySelector('.px-drawer-wrapper')
		expect(container).toBeTruthy()

		rtn.close()

		await vi.advanceTimersByTimeAsync(UNMOUNT_DELAY + 50)
		expect(document.querySelector(`[id="${container!.id}"]`)).toBeNull()
	})
	it('slot render', async () => {
		Drawer.open({
			content: 'content',
			title: 'title',
			footer: 'footer',
			showFooter: true
		})
		const container = document.querySelector('.px-drawer-wrapper')
		expect(container?.querySelector('.px-drawer-header')?.textContent).toBe('title')
		expect(container?.querySelector('.px-drawer-body')?.textContent).toBe('content')
		expect(container?.querySelector('.px-drawer-footer')?.textContent).toBe('footer')
	})
})
