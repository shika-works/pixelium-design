import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMocks } from '../../share/util/test'
import { mount } from '@vue/test-utils'
import { useForm } from '../use-form'
import Form from '../index.vue'
import FormItem from '../../form-item/index.vue'
import Input from '../../input/index.vue'
import { h, nextTick } from 'vue'

describe('Form Hook', async () => {
	const { pre, post } = createMocks()
	beforeEach(pre)
	afterEach(post)

	const userRules = {
		username: [{ required: true, message: 'Please input username' }],
		email: [{ required: true, email: true, message: 'Please input valid email' }]
	}

	it('hook return is correct', async () => {
		const userForm = useForm({
			initialValues: { username: '', email: '' }
		})
		userForm.register = vi.fn()
		mount(Form, {
			props: {
				form: userForm
			},
			global: {
				components: {
					FormItem,
					Input
				}
			},
			slots: {
				default: () => {
					return [
						h(
							FormItem,
							{ field: 'username', label: 'Username' },
							{
								default: () =>
									h(Input, {
										modelValue: userForm.model.value.username,
										'onUpdate:modelValue': (e) => (userForm.model.value.username = e),
										placeholder: 'Username'
									})
							}
						),
						h(
							FormItem,
							{ field: 'email', label: 'Email' },
							{
								default: () =>
									h(Input, {
										modelValue: userForm.model.value.email,
										'onUpdate:modelValue': (e) => (userForm.model.value.email = e),
										placeholder: 'Email'
									})
							}
						)
					]
				}
			}
		})
		await nextTick()

		expect(userForm.model.value).toEqual({ username: '', email: '' })
		expect(userForm.register).toBeCalled()
		expect(userForm.reset).toBeTruthy()
		expect(userForm.clearValidation).toBeTruthy()
		expect(userForm.validate).toBeTruthy()
	})

	it('binds inputs to form model when typing', async () => {
		const userForm = useForm({
			initialValues: { username: '', email: '' }
		})
		const wrapper = mount(Form, {
			props: {
				form: userForm,
				rules: userRules
			},
			global: {
				components: {
					FormItem,
					Input
				}
			},
			slots: {
				default: () => {
					return [
						h(
							FormItem,
							{ field: 'username', label: 'Username' },
							{
								default: () =>
									h(Input, {
										modelValue: userForm.model.value.username,
										'onUpdate:modelValue': (e) => (userForm.model.value.username = e),
										placeholder: 'Username'
									})
							}
						),
						h(
							FormItem,
							{ field: 'email', label: 'Email' },
							{
								default: () =>
									h(Input, {
										modelValue: userForm.model.value.email,
										'onUpdate:modelValue': (e) => (userForm.model.value.email = e),
										placeholder: 'Email'
									})
							}
						)
					]
				}
			}
		})
		const usernameInput = wrapper.find('input[placeholder="Username"]')
		const emailInput = wrapper.find('input[placeholder="Email"]')

		await usernameInput.setValue('alice')
		await emailInput.setValue('alice@example.com')
		await nextTick()

		expect(userForm).toBeTruthy()
		expect(userForm.model.value.username).toBe('alice')
		expect(userForm.model.value.email).toBe('alice@example.com')
	})

	it('validate fields', async () => {
		const userForm = useForm({
			initialValues: { username: '', email: '' }
		})
		const wrapper = mount(Form, {
			props: {
				form: userForm,
				rules: userRules
			},
			global: {
				components: {
					FormItem,
					Input
				}
			},
			slots: {
				default: () => {
					return [
						h(
							FormItem,
							{ field: 'username', label: 'Username' },
							{
								default: () =>
									h(Input, {
										modelValue: userForm.model.value.username,
										'onUpdate:modelValue': (e) => (userForm.model.value.username = e),
										placeholder: 'Username'
									})
							}
						),
						h(
							FormItem,
							{ field: 'email', label: 'Email' },
							{
								default: () =>
									h(Input, {
										modelValue: userForm.model.value.email,
										'onUpdate:modelValue': (e) => (userForm.model.value.email = e),
										placeholder: 'Email'
									})
							}
						)
					]
				}
			}
		})
		await nextTick()

		const res = await userForm.validate()
		expect(res).toEqual({
			isValid: false,
			results: {
				email: {
					status: 'fulfilled',
					value: {
						level: 'error',
						message: 'Please input valid email'
					}
				},
				username: {
					status: 'fulfilled',
					value: {
						level: 'error',
						message: 'Please input username'
					}
				}
			}
		})
		const tips = wrapper.findAll('.px-form-item-tip')
		expect(tips.length).eq(2)
	})

	it('reset resets model and input values', async () => {
		const userForm = useForm({
			initialValues: { username: '', email: '' }
		})
		const wrapper = mount(Form, {
			props: {
				form: userForm,
				rules: userRules
			},
			global: {
				components: {
					FormItem,
					Input
				}
			},
			slots: {
				default: () => {
					return [
						h(
							FormItem,
							{ field: 'username', label: 'Username' },
							{
								default: () =>
									h(Input, {
										modelValue: userForm.model.value.username,
										'onUpdate:modelValue': (e) => (userForm.model.value.username = e),
										placeholder: 'Username'
									})
							}
						),
						h(
							FormItem,
							{ field: 'email', label: 'Email' },
							{
								default: () =>
									h(Input, {
										modelValue: userForm.model.value.email,
										'onUpdate:modelValue': (e) => (userForm.model.value.email = e),
										placeholder: 'Email'
									})
							}
						)
					]
				}
			}
		})
		await nextTick()

		const usernameInput = wrapper.find('input[placeholder="Username"]')
		const emailInput = wrapper.find('input[placeholder="Email"]')

		await usernameInput.setValue('charlie')
		await emailInput.setValue('charlie@example.com')
		await nextTick()

		userForm.reset('email')
		await nextTick()
		expect(userForm.model.value.email).toEqual('')

		userForm.reset()
		await nextTick()
		expect(userForm.model.value.username).toEqual('')
	})

	it('clear validation button calls clearValidation on the form', async () => {
		const userForm = useForm({
			initialValues: { username: '', email: '' }
		})
		const wrapper = mount(Form, {
			props: {
				form: userForm,
				rules: userRules
			},
			global: {
				components: {
					FormItem,
					Input
				}
			},
			slots: {
				default: () => {
					return [
						h(
							FormItem,
							{ field: 'username', label: 'Username' },
							{
								default: () =>
									h(Input, {
										modelValue: userForm.model.value.username,
										'onUpdate:modelValue': (e) => (userForm.model.value.username = e),
										placeholder: 'Username'
									})
							}
						),
						h(
							FormItem,
							{ field: 'email', label: 'Email' },
							{
								default: () =>
									h(Input, {
										modelValue: userForm.model.value.email,
										'onUpdate:modelValue': (e) => (userForm.model.value.email = e),
										placeholder: 'Email'
									})
							}
						)
					]
				}
			}
		})
		await nextTick()

		await userForm.validate()

		const tips1 = wrapper.findAll('.px-form-item-tip')
		expect(tips1.length).eq(2)

		userForm.clearValidation()
		await nextTick()

		const tips2 = wrapper.findAll('.px-form-item-tip')
		expect(tips2.length).eq(0)
	})
})
