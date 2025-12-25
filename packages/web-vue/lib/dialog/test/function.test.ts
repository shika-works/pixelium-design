import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMocks } from '../../share/util/test'
import Dialog from '../index.ts'
import { nextTick } from 'vue'

function findButtonByText(container: Element | null, text: string) {
	return Array.from(container?.querySelectorAll('button') || []).find(
		(btn) => btn.textContent?.trim() === text
	) as HTMLButtonElement | undefined
}

describe('Dialog functional calls (index.ts)', () => {
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
		// remove any leftover dialog wrappers
		document.querySelectorAll('.px-dialog-wrapper').forEach((el) => el.remove())
		vi.useRealTimers()
		post()
	})

	it('static function exited', () => {
		expect('info' in Dialog).toBe(true)
		expect('success' in Dialog).toBe(true)
		expect('warning' in Dialog).toBe(true)
		expect('error' in Dialog).toBe(true)
		expect('confirm' in Dialog).toBe(true)
		expect('normal' in Dialog).toBe(true)
	})

	it('resolves true when confirm clicked and removes container', async () => {
		const promise = Dialog.info('test content')
		await nextTick()

		const container = document.querySelector('.px-dialog-wrapper')
		expect(container).toBeTruthy()

		const confirmBtn = findButtonByText(container, '确认')
		expect(confirmBtn).toBeTruthy()

		await expect(
			new Promise<void>((resolve) => {
				void (promise as Promise<boolean>).then((v) => {
					expect(v).toBe(true)
					resolve()
				})
				confirmBtn!.click()
			})
		).resolves.toBeUndefined()

		// allow unmount timer to run
		await vi.advanceTimersByTimeAsync(UNMOUNT_DELAY + 50)
		expect(document.querySelector(`[id="${container!.id}"]`)).toBeNull()
	})

	it('resolves false when cancel clicked on confirm dialog and removes container', async () => {
		const promise = Dialog.confirm('please confirm')
		await nextTick()

		const container = document.querySelector('.px-dialog-wrapper')
		expect(container).toBeTruthy()

		const cancelBtn = findButtonByText(container, '取消')
		expect(cancelBtn).toBeTruthy()

		await expect(
			new Promise<void>((resolve) => {
				void (promise as Promise<boolean>).then((v) => {
					expect(v).toBe(false)
					resolve()
				})
				cancelBtn!.click()
			})
		).resolves.toBeUndefined()

		await vi.advanceTimersByTimeAsync(UNMOUNT_DELAY + 50)
		expect(document.querySelector(`[id="${container!.id}"]`)).toBeNull()
	})

	it("calling promise.close removes container but doesn't resolve the promise", async () => {
		const promise = Dialog.info('close test')
		await nextTick()

		const container = document.querySelector('.px-dialog-wrapper')
		expect(container).toBeTruthy()

		let resolved = false
		void (promise as Promise<boolean>).then(() => {
			resolved = true
		})

		promise.close()

		await vi.advanceTimersByTimeAsync(UNMOUNT_DELAY + 50)
		expect(document.querySelector(`[id="${container!.id}"]`)).toBeNull()
		expect(resolved).toBe(false)
	})
})
