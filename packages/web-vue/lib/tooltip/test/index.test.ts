import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import Popover from '../index.vue'
import Popup from '../../popup/index.vue'
import { createMocks } from '../../share/util/test'

const { pre, post } = createMocks()

beforeEach(() => {
	pre()
})

afterEach(() => {
	post()
	vi.restoreAllMocks()
})

describe('Popover Component', () => {
	it('Check props of inner popup component', async () => {
		const onClose = vi.fn()
		const onOpen = vi.fn()
		const onupdateVisible = vi.fn()
		const wrapper = mount(Popover, {
			props: {
				placement: 'left',
				trigger: 'click',
				offset: 0,
				root: 'html',
				arrow: false,
				visible: true,
				defaultVisible: false,
				widthEqual: true,
				onClose,
				onOpen,
				'onUpdate:visible': onupdateVisible
			},
			slots: {
				default: '<button id="trigger-btn">Open</button>'
			}
		})

		const popupVm = wrapper.getComponent(Popup).vm
		const props = popupVm.$props
		expect(props.placement).toBe('left')
		expect(props.trigger).toBe('click')
		expect(props.offset).toBe(0)
		expect(props.root).toBe('html')
		expect(props.arrow).toBe(false)
		expect(props.visible).toBe(true)
		expect(props.defaultVisible).toBe(false)
		expect(props.widthEqual).toBe(true)
		expect(props.variant).toBe('dark')

		popupVm.$emit('close')
		expect(onClose).toHaveBeenCalled()
		popupVm.$emit('open')
		expect(onOpen).toHaveBeenCalled()
		popupVm.$emit('update:visible', false)
		expect(onupdateVisible).toHaveBeenCalledWith(false)
	})
})
