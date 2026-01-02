import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PxLink from '../index.vue'
import SpinnerThirdSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/spinner-third-solid.svg'
import { createMocks } from '../../share/util/test'

describe('Link Component', () => {
	const { pre, post } = createMocks()
	beforeEach(() => {
		pre()
	})
	afterEach(() => {
		post()
	})
	it('renders correctly with default props', () => {
		const wrapper = mount(PxLink, {
			slots: {
				default: 'Click me'
			}
		})

		expect(wrapper.find('a').exists()).toBe(true)
		expect(wrapper.text()).toBe('Click me')
		expect(wrapper.classes()).toContain('px-link__primary')
		expect(wrapper.classes()).toContain('px-link__underline')
	})

	it('renders with icon slot', () => {
		const wrapper = mount(PxLink, {
			slots: {
				default: 'Click me',
				icon: '<span data-test="icon">★</span>'
			}
		})

		expect(wrapper.find('[data-test="icon"]').exists()).toBe(true)
		expect(wrapper.find('.px-link-icon-wrapper').exists()).toBe(true)
	})

	it('renders loading state', () => {
		const wrapper = mount(PxLink, {
			props: {
				loading: true
			},
			slots: {
				default: 'Loading...'
			}
		})

		expect(wrapper.classes()).toContain('px-link__loading')
		expect(wrapper.findComponent(SpinnerThirdSolid as any).exists()).toBe(true)
		expect(wrapper.find('.px-animation__loading').exists()).toBe(true)
	})

	it('renders disabled state', () => {
		const wrapper = mount(PxLink, {
			props: {
				disabled: true
			},
			slots: {
				default: 'Disabled Link'
			}
		})

		expect(wrapper.classes()).toContain('px-link__disabled')
	})

	it('renders different themes', () => {
		const themes: Array<'primary' | 'sakura' | 'success' | 'warning' | 'danger' | 'info'> = [
			'primary',
			'sakura',
			'success',
			'warning',
			'danger',
			'info'
		]

		themes.forEach((theme) => {
			const wrapper = mount(PxLink, {
				props: { theme },
				slots: { default: theme }
			})

			expect(wrapper.classes()).toContain(`px-link__${theme}`)
		})
	})

	it('renders different variants', () => {
		const normalWrapper = mount(PxLink, {
			props: { variant: 'normal' },
			slots: { default: 'Normal' }
		})

		const underlineWrapper = mount(PxLink, {
			props: { variant: 'underline' },
			slots: { default: 'Underline' }
		})

		expect(normalWrapper.classes()).toContain('px-link__normal')
		expect(underlineWrapper.classes()).toContain('px-link__underline')
	})

	it('applies custom color palette', () => {
		const wrapper = mount(PxLink, {
			props: {
				color: '#ff0000'
			},
			slots: {
				default: 'Custom Color'
			}
		})

		expect(wrapper.classes()).toContain('px-link__custom')
		expect(wrapper.attributes('style')).toContain('color: rgb(255, 0, 0)')
	})

	it('handles click events correctly', async () => {
		const mockEvent = {
			preventDefault: vi.fn()
		}

		const onClick = vi.fn()
		const wrapper = mount(PxLink, {
			props: {
				onClick
			},
			slots: {
				default: 'Clickable'
			}
		})

		await wrapper.trigger('click', mockEvent)
		expect(onClick).toHaveBeenCalledTimes(1)
		expect(mockEvent.preventDefault).not.toBeCalled()
	})

	it('prevents click when disabled', async () => {
		const mockEvent = {
			preventDefault: vi.fn()
		}

		const onClick = vi.fn()
		const wrapper = mount(PxLink, {
			props: {
				disabled: true,
				onClick
			},
			slots: {
				default: 'Disabled'
			}
		})

		await wrapper.trigger('click', mockEvent)
		expect(onClick).toHaveBeenCalled()
		expect(mockEvent.preventDefault).toBeCalled()
	})

	it('prevents click when loading', async () => {
		const mockEvent = {
			preventDefault: vi.fn()
		}

		const onClick = vi.fn()
		const wrapper = mount(PxLink, {
			props: {
				loading: true,
				onClick
			},
			slots: {
				default: 'Loading'
			}
		})

		await wrapper.trigger('click', mockEvent)
		expect(onClick).toHaveBeenCalled()
		expect(mockEvent.preventDefault).toBeCalled()
	})

	it('handles href and target attributes', () => {
		const wrapper = mount(PxLink, {
			props: {
				href: 'https://example.com',
				target: '_blank'
			},
			slots: {
				default: 'External Link'
			}
		})

		expect(wrapper.attributes('href')).toBe('https://example.com')
		expect(wrapper.attributes('target')).toBe('_blank')
	})

	it('handles mouse events for hover and active states', async () => {
		const wrapper = mount(PxLink, {
			props: {
				color: '#ff0000'
			},
			slots: {
				default: 'Interactive'
			}
		})

		// Test hover
		await wrapper.trigger('mouseenter')
		// @ts-ignore
		expect(wrapper.vm.hoverFlag).toBe(true)

		await wrapper.trigger('mouseleave')
		// @ts-ignore
		expect(wrapper.vm.hoverFlag).toBe(false)

		// Test active
		await wrapper.trigger('mousedown')
		// @ts-ignore
		expect(wrapper.vm.activeFlag).toBe(true)

		await wrapper.trigger('mouseup')
		// @ts-ignore
		expect(wrapper.vm.activeFlag).toBe(false)
	})

	it('renders icon wrapper with correct class when no default slot', () => {
		const wrapper = mount(PxLink, {
			slots: {
				icon: '<span>Icon</span>'
			}
		})

		expect(wrapper.find('.px-link-icon-wrapper__last').exists()).toBe(true)
	})

	it('applies correct text color based on state with palette', async () => {
		const wrapper = mount(PxLink, {
			props: {
				color: '#ff0000'
			},
			slots: {
				default: 'Stateful Color'
			}
		})

		// Initial color (normal state)
		expect(wrapper.attributes('style')).toContain('rgb(255, 0, 0)')

		// Hover state
		await wrapper.trigger('mouseenter')
		expect(wrapper.attributes('style')).toContain('rgb(255, 97, 80)')

		// Active state
		await wrapper.trigger('mousedown')
		expect(wrapper.attributes('style')).toContain('rgb(186, 34, 25)')
	})

	it('handles color parsing failure gracefully', () => {
		const wrapper = mount(PxLink, {
			props: {
				color: 'invalid-color'
			},
			slots: {
				default: 'Invalid Color'
			}
		})

		expect(wrapper.classes()).not.toContain('px-link__custom')
	})
})
