import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import BaseDatePicker from '../index.vue'
import { createMocks } from '../../share/util/test'

async function waitForUpdate() {
	await nextTick()
}

function getSingleInput(wrapper: VueWrapper) {
	return wrapper.find('input.px-base-date-picker-inner')
}

function getStartInput(wrapper: VueWrapper) {
	return wrapper.find('input.px-base-date-picker-inner-start')
}

function getEndInput(wrapper: VueWrapper) {
	return wrapper.find('input.px-base-date-picker-inner-end')
}

async function triggerInputChange(inputElement: HTMLInputElement, value: string) {
	inputElement.value = value
	inputElement.dispatchEvent(new Event('input'))
	inputElement.dispatchEvent(new Event('change'))
	await waitForUpdate()
}

describe('BaseDatePicker Input Parsing', () => {
	const { pre, post } = createMocks()

	afterEach(() => {
		post()
	})
	beforeEach(() => {
		pre()
	})
	describe('Single date mode (mode="date")', () => {
		it('should parse valid YYYY-MM-DD string to Date', async () => {
			const modelValue = ref<Date | Date[] | null>(null)
			const wrapper = mount(BaseDatePicker, {
				props: {
					mode: 'date',
					modelValue: modelValue.value,
					'onUpdate:modelValue': (val: any) => (modelValue.value = val)
				}
			})

			const input = getSingleInput(wrapper).element as HTMLInputElement
			await triggerInputChange(input, '2025-03-15')

			const result = modelValue.value as Date
			expect(result).toBeInstanceOf(Date)
			expect(result.getFullYear()).toBe(2025)
			expect(result.getMonth()).toBe(2) // 0-indexed, March
			expect(result.getDate()).toBe(15)
		})

		it('should ignore invalid date string and keep previous value', async () => {
			const initialDate = new Date(2025, 0, 1)
			const modelValue = ref<Date | Date[] | null>(initialDate)
			const wrapper = mount(BaseDatePicker, {
				props: {
					mode: 'date',
					modelValue: modelValue.value,
					'onUpdate:modelValue': (val: any) => (modelValue.value = val)
				}
			})

			const input = getSingleInput(wrapper).element as HTMLInputElement
			await triggerInputChange(input, 'invalid-date')

			expect(modelValue.value).toBe(initialDate)
		})
	})

	describe('Month mode (mode="month")', () => {
		it('should parse YYYY-MM string to first day of month', async () => {
			const modelValue = ref<Date | Date[] | null>(null)
			const wrapper = mount(BaseDatePicker, {
				props: {
					mode: 'month',
					modelValue: modelValue.value,
					'onUpdate:modelValue': (val: any) => (modelValue.value = val)
				}
			})

			const input = getSingleInput(wrapper).element as HTMLInputElement
			await triggerInputChange(input, '2025-04')

			const result = modelValue.value as Date
			expect(result).toBeInstanceOf(Date)
			expect(result.getFullYear()).toBe(2025)
			expect(result.getMonth()).toBe(3) // April
			expect(result.getDate()).toBe(1)
		})
	})

	describe('Year mode (mode="year")', () => {
		it('should parse YYYY string to January 1st of that year', async () => {
			const modelValue = ref<Date | Date[] | null>(null)
			const wrapper = mount(BaseDatePicker, {
				props: {
					mode: 'year',
					modelValue: modelValue.value,
					'onUpdate:modelValue': (val: any) => (modelValue.value = val)
				}
			})

			const input = getSingleInput(wrapper).element as HTMLInputElement
			await triggerInputChange(input, '2030')

			const result = modelValue.value as Date
			expect(result).toBeInstanceOf(Date)
			expect(result.getFullYear()).toBe(2030)
			expect(result.getMonth()).toBe(0)
			expect(result.getDate()).toBe(1)
		})
	})

	describe('Date-time mode (mode="date-time")', () => {
		it('should parse YYYY-MM-DD HH:mm:ss string', async () => {
			const modelValue = ref<Date | Date[] | null>(null)
			const wrapper = mount(BaseDatePicker, {
				props: {
					mode: 'date-time',
					modelValue: modelValue.value,
					'onUpdate:modelValue': (val: any) => (modelValue.value = val)
				}
			})

			const input = getSingleInput(wrapper).element as HTMLInputElement
			await triggerInputChange(input, '2025-06-20 14:30:45')

			const result = modelValue.value as Date
			expect(result).toBeInstanceOf(Date)
			expect(result.getFullYear()).toBe(2025)
			expect(result.getMonth()).toBe(5) // June
			expect(result.getDate()).toBe(20)
			expect(result.getHours()).toBe(14)
			expect(result.getMinutes()).toBe(30)
			expect(result.getSeconds()).toBe(45)
		})

		it('should parse 12-hour format with AM/PM when use12Hours is true', async () => {
			const modelValue = ref<Date | Date[] | null>(null)
			const wrapper = mount(BaseDatePicker, {
				props: {
					mode: 'date-time',
					use12Hours: true,
					modelValue: modelValue.value,
					'onUpdate:modelValue': (val: any) => (modelValue.value = val)
				}
			})

			const input = getSingleInput(wrapper).element as HTMLInputElement
			await triggerInputChange(input, '2025-06-20 02:30:45 PM')

			const result = modelValue.value as Date
			expect(result).toBeInstanceOf(Date)
			expect(result.getHours()).toBe(14) // 2 PM -> 14
		})
	})

	describe('Time mode (mode="time")', () => {
		it('should parse HH:mm:ss to current date with given time', async () => {
			const modelValue = ref<Date | Date[] | null>(null)
			const wrapper = mount(BaseDatePicker, {
				props: {
					mode: 'time',
					modelValue: modelValue.value,
					'onUpdate:modelValue': (val: any) => (modelValue.value = val)
				}
			})

			const input = getSingleInput(wrapper).element as HTMLInputElement
			await triggerInputChange(input, '09:15:30')

			const result = modelValue.value as Date
			expect(result).toBeInstanceOf(Date)
			expect(result.getFullYear()).toBe(1970)
			expect(result.getMonth()).toBe(0)
			expect(result.getDate()).toBe(1)
			expect(result.getHours()).toBe(9)
			expect(result.getMinutes()).toBe(15)
			expect(result.getSeconds()).toBe(30)
		})
	})

	describe('Week mode (mode="week")', () => {
		it('should parse YYYY-Www to the first day of that week (Monday)', async () => {
			const modelValue = ref<Date | Date[] | null>(null)
			const wrapper = mount(BaseDatePicker, {
				props: {
					mode: 'week',
					modelValue: modelValue.value,
					'onUpdate:modelValue': (val: any) => (modelValue.value = val)
				}
			})

			const input = getSingleInput(wrapper).element as HTMLInputElement
			await triggerInputChange(input, '2025-W10')

			const result = modelValue.value as Date
			expect(result).toBeInstanceOf(Date)
			expect(result.getFullYear()).toBe(2025)
			// Week 10 of 2025 starts on March 3 (Monday)
			expect(result.getMonth()).toBe(2)
			expect(result.getDate()).toBe(3)
		})
	})

	describe('Quarter mode (mode="quarter")', () => {
		it('should parse YYYY-[Q]Q to first day of the quarter', async () => {
			const modelValue = ref<Date | Date[] | null>(null)
			const wrapper = mount(BaseDatePicker, {
				props: {
					mode: 'quarter',
					modelValue: modelValue.value,
					'onUpdate:modelValue': (val: any) => (modelValue.value = val)
				}
			})

			const input = getSingleInput(wrapper).element as HTMLInputElement
			await triggerInputChange(input, '2025-Q2')

			const result = modelValue.value as Date
			expect(result).toBeInstanceOf(Date)
			expect(result.getFullYear()).toBe(2025)
			expect(result.getMonth()).toBe(3) // April (Q2 start)
			expect(result.getDate()).toBe(1)
		})
	})

	describe('Date range mode (mode="date-range")', () => {
		it('should parse start and end dates from separate inputs', async () => {
			const modelValue = ref<Date[] | null>(null)
			const wrapper = mount(BaseDatePicker, {
				props: {
					mode: 'date-range',
					modelValue: modelValue.value,
					'onUpdate:modelValue': (val: any) => (modelValue.value = val)
				}
			})

			const startInput = getStartInput(wrapper).element as HTMLInputElement
			const endInput = getEndInput(wrapper).element as HTMLInputElement

			// Set start date
			await triggerInputChange(startInput, '2025-08-10')
			expect(modelValue.value).toHaveLength(2)
			expect(modelValue.value![0].getFullYear()).toBe(2025)
			expect(modelValue.value![0].getMonth()).toBe(7)
			expect(modelValue.value![0].getDate()).toBe(10)

			// Set end date
			await triggerInputChange(endInput, '2025-08-20')
			expect(modelValue.value![1].getFullYear()).toBe(2025)
			expect(modelValue.value![1].getMonth()).toBe(7)
			expect(modelValue.value![1].getDate()).toBe(20)

			// Verify order is correct (start <= end)
			expect(modelValue.value![0].getTime()).toBeLessThanOrEqual(modelValue.value![1].getTime())
		})

		it('should auto-correct when end date is before start date', async () => {
			const modelValue = ref<Date[] | null>(null)
			const wrapper = mount(BaseDatePicker, {
				props: {
					mode: 'date-range',
					modelValue: modelValue.value,
					'onUpdate:modelValue': (val: any) => (modelValue.value = val)
				}
			})

			const startInput = getStartInput(wrapper).element as HTMLInputElement
			const endInput = getEndInput(wrapper).element as HTMLInputElement

			// Set start date first
			await triggerInputChange(startInput, '2025-09-15')
			// Then set end date before start
			await triggerInputChange(endInput, '2025-09-10')

			// Component should swap or adjust (in this implementation, end date becomes same as start)
			expect(modelValue.value![1].getTime()).toBeGreaterThanOrEqual(
				modelValue.value![0].getTime()
			)
		})
	})

	describe('Month range mode (mode="month-range")', () => {
		it('should parse start and end months', async () => {
			const modelValue = ref<Date[] | null>(null)
			const wrapper = mount(BaseDatePicker, {
				props: {
					mode: 'month-range',
					modelValue: modelValue.value,
					'onUpdate:modelValue': (val: any) => (modelValue.value = val)
				}
			})

			const startInput = getStartInput(wrapper).element as HTMLInputElement
			const endInput = getEndInput(wrapper).element as HTMLInputElement

			await triggerInputChange(startInput, '2025-03')
			wrapper.setProps({ modelValue: modelValue.value })
			await nextTick()
			await triggerInputChange(endInput, '2025-06')

			expect(modelValue.value).toHaveLength(2)
			expect(modelValue.value![0].getFullYear()).toBe(2025)
			expect(modelValue.value![0].getMonth()).toBe(2)
			expect(modelValue.value![1].getFullYear()).toBe(2025)
			expect(modelValue.value![1].getMonth()).toBe(5)
		})
	})

	describe('Time range mode (mode="time-range")', () => {
		it('should parse start and end times', async () => {
			const modelValue = ref<Date[] | null>(null)
			const wrapper = mount(BaseDatePicker, {
				props: {
					mode: 'time-range',
					modelValue: modelValue.value,
					'onUpdate:modelValue': (val: any) => (modelValue.value = val)
				}
			})

			const startInput = getStartInput(wrapper).element as HTMLInputElement
			const endInput = getEndInput(wrapper).element as HTMLInputElement

			await triggerInputChange(startInput, '08:00:00')
			wrapper.setProps({ modelValue: modelValue.value })
			await nextTick()
			await triggerInputChange(endInput, '17:30:00')

			expect(modelValue.value).toHaveLength(2)
			expect(modelValue.value![0].getHours()).toBe(8)
			expect(modelValue.value![0].getMinutes()).toBe(0)
			expect(modelValue.value![1].getHours()).toBe(17)
			expect(modelValue.value![1].getMinutes()).toBe(30)
		})
	})

	describe('Custom format prop', () => {
		it('should use custom parse and format functions when both provided', async () => {
			const customFormat = (date: Date) => {
				const day = String(date.getDate()).padStart(2, '0')
				const month = String(date.getMonth() + 1).padStart(2, '0')
				const year = date.getFullYear()
				return `${day}/${month}/${year}`
			}

			const customParse = (str: string) => {
				const parts = str.split('/')
				return new Date(+parts[2], +parts[1] - 1, +parts[0])
			}

			const modelValue = ref<Date | null>(new Date(2025, 11, 31))
			const wrapper = mount(BaseDatePicker, {
				props: {
					mode: 'date',
					format: customFormat,
					parse: customParse,
					modelValue: modelValue.value,
					'onUpdate:modelValue': (val: any) => (modelValue.value = val)
				}
			})

			const input = getSingleInput(wrapper).element as HTMLInputElement
			expect(input.value).toBe('31/12/2025')

			await triggerInputChange(input, '15/08/2026')

			const result = modelValue.value as Date
			expect(result.getFullYear()).toBe(2026)
			expect(result.getMonth()).toBe(7)
			expect(result.getDate()).toBe(15)

			wrapper.setProps({
				modelValue: modelValue.value
			})
			await nextTick()
			expect(input.value).toBe('15/08/2026')
		})

		it('should parse and format using custom template "DD/MM/YYYY"', async () => {
			const modelValue = ref<Date | null>(new Date(2025, 11, 31))
			const wrapper = mount(BaseDatePicker, {
				props: {
					mode: 'date',
					template: 'DD/MM/YYYY',
					modelValue: modelValue.value,
					'onUpdate:modelValue': (val: any) => (modelValue.value = val)
				}
			})

			const input = getSingleInput(wrapper).element as HTMLInputElement

			expect(input.value).toBe('31/12/2025')

			await triggerInputChange(input, '01/05/2026')

			const result = modelValue.value as Date
			expect(result.getFullYear()).toBe(2026)
			expect(result.getMonth()).toBe(4)
			expect(result.getDate()).toBe(1)

			await triggerInputChange(input, 'invalid')
			expect(modelValue.value).toBe(result)
		})
	})
})
