import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import Table from '../index.vue'
import { h, nextTick, ref, watch } from 'vue'
import Radio from '../../radio/index.vue'
import Checkbox from '../../checkbox/index.vue'
import { DEFAULT_ADDITION_COL_WIDTH } from '../module/share'
import type {
	FilterValue,
	SortOrder,
	TableColumn,
	TableData,
	TableOptionsArg,
	TableSummary
} from '../type'
import PopupWrapper from '../../popup-wrapper/index.vue'
import { createMocks } from '../../share/util/test'
import Spin from '../../spin/index.vue'
import Select from '../../select/index.vue'
describe('Table Component Example', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})
	test('hierarchical head', () => {
		const columns = [
			{
				label: 'Basic Information',
				key: 'base-info',
				fixed: 'left' as const,
				children: [
					{
						label: 'ID',
						field: 'id',
						width: 80,
						key: 'id'
					},
					{
						label: 'Name',
						field: 'name',
						width: 120,
						key: 'name'
					}
				]
			},
			{
				label: 'Contact Information',
				key: 'contactInformation',
				children: [
					{
						label: 'Contact Details',
						key: 'contactDetails',
						children: [
							{
								key: 'phone',
								label: 'Phone',
								field: 'phone',
								width: 120
							},
							{
								key: 'email',
								label: 'Email',
								field: 'email',
								minWidth: 180
							}
						]
					},
					{
						label: 'Address',
						field: 'address',
						key: 'address',
						minWidth: 200
					}
				]
			},
			{
				label: 'Work Information',
				key: 'workInformation',
				fixed: 'right' as const,
				children: [
					{
						label: 'Department',
						field: 'department',
						key: 'department',
						width: 120
					},
					{
						label: 'Salary Information',
						key: 'salaryInformation',
						children: [
							{
								label: 'Base Salary',
								field: 'baseSalary',
								key: 'baseSalary',
								width: 100
							},
							{
								label: 'Bonus',
								field: 'bonus',
								key: 'bonus',
								width: 100
							},
							{
								label: 'Total',
								field: 'totalSalary',
								key: 'totalSalary',
								width: 100
							}
						]
					}
				]
			},
			{
				label: 'Status',
				field: 'status',
				key: 'status',
				width: 80,
				fixed: 'right' as const
			}
		]

		const data = [
			{
				id: 1,
				name: 'John Smith',
				phone: '13800138001',
				email: 'john.smith@example.com',
				address: '123 Main St, New York, NY',
				department: 'Sales',
				baseSalary: 5000,
				bonus: 1000,
				totalSalary: 6000,
				status: 'Active'
			}
		]
		const wrapper = mount(Table, {
			props: {
				columns,
				data
			}
		})

		expect(wrapper.find('.px-table__hierarchical-head.px-table-area').exists()).toBeTruthy()

		const htr = wrapper.findAll('thead tr')
		const expectData = [
			{
				text: ['Basic Information', 'Contact Information', 'Work Information', 'Status'],
				width: ['200px', '', '420px', '80px'],
				minWidth: ['0px', '380px', '0px', '0px'],
				fixed: ['left', 'none', 'right', 'right'],
				leaf: [false, false, false, true]
			},
			{
				text: ['ID', 'Name', 'Contact Details', 'Address', 'Department', 'Salary Information'],
				width: ['80px', '120px', '', '', '120px', '300px'],
				minWidth: ['0px', '0px', '180px', '200px', '0px', '0px'],
				fixed: ['left', 'left', 'none', 'none', 'right', 'right'],
				leaf: [true, true, false, true, true, false]
			},
			{
				text: ['Phone', 'Email', 'Base Salary', 'Bonus', 'Total'],
				width: ['120px', '', '100px', '100px', '100px'],
				minWidth: ['0px', '180px', '0px', '0px', '0px'],
				fixed: ['none', 'none', 'right', 'right', 'right'],
				leaf: [true, true, true, true, true]
			}
		]
		htr.forEach((e, i) => {
			const th = e.findAll('th')
			const text = th.map((e) => e.text())
			const width = th.map((e) => e.element.style.width)
			const minWidth = th.map((e) => e.element.style.minWidth)
			const fixed = th.map((e) =>
				e.element.className.includes('px-table-th__left-fixed')
					? 'left'
					: e.element.className.includes('px-table-th__right-fixed')
						? 'right'
						: 'none'
			)
			const leaf = th.map((e) => e.element.className.includes('px-table-th__leaf'))
			expect(text).toEqual(expectData[i].text)
			expect(width).toEqual(expectData[i].width)
			expect(minWidth).toEqual(expectData[i].minWidth)
			expect(fixed).toEqual(expectData[i].fixed)
			expect(leaf).toEqual(expectData[i].leaf)
		})
		const btr = wrapper.find('tbody tr')
		{
			const td = btr.findAll('td')
			const text = td.map((e) => e.text())
			const width = td.map((e) => e.element.style.width)
			const minWidth = td.map((e) => e.element.style.minWidth)
			const fixed = td.map((e) =>
				e.element.className.includes('px-table-td__left-fixed')
					? 'left'
					: e.element.className.includes('px-table-td__right-fixed')
						? 'right'
						: 'none'
			)
			expect(text).toEqual([
				'1',
				'John Smith',
				'13800138001',
				'john.smith@example.com',
				'123 Main St, New York, NY',
				'Sales',
				'5000',
				'1000',
				'6000',
				'Active'
			])
			expect(width).toEqual([
				'80px',
				'120px',
				'120px',
				'',
				'',
				'120px',
				'100px',
				'100px',
				'100px',
				'80px'
			])
			expect(minWidth).toEqual([
				'0px',
				'0px',
				'',
				'180px',
				'200px',
				'0px',
				'0px',
				'0px',
				'0px',
				'0px'
			])
			expect(fixed).toEqual([
				'left',
				'left',
				'none',
				'none',
				'none',
				'right',
				'right',
				'right',
				'right',
				'right'
			])
		}
	})
	test('single selection', async () => {
		const data = [
			{
				id: 1001
			},
			{
				id: 1002
			}
		]
		const columns = [
			{
				key: 'id',
				label: 'ID',
				field: 'id'
			}
		]
		const selection = {
			multiple: false,
			label: 'Select',
			fixed: true
		}

		const selectedKeys = ref<number[]>([])

		const wrapper = mount(Table, {
			props: {
				data,
				columns,
				selection,
				'onUpdate:selectedKeys': (v) => (selectedKeys.value = v),
				selectedKeys: selectedKeys.value,
				rowKey: 'id'
			},
			attachTo: 'body'
		})

		const selectHead = wrapper.find('th')
		expect(selectHead.text()).toBe('Select')
		expect(selectHead.element.className).includes('px-table-th__left-fixed')
		expect(selectHead.element.style.width).toBe(DEFAULT_ADDITION_COL_WIDTH + 'px')

		const firstCell = wrapper.findAll('tbody tr').map((e) => e.find('td'))

		expect(firstCell.length).toBe(2)
		firstCell.forEach((e) => {
			expect(e.element.className).includes('px-table-td__left-fixed')
			expect(e.element.style.width).toBe(DEFAULT_ADDITION_COL_WIDTH + 'px')
		})

		const radios = wrapper.findAllComponents(Radio)

		expect(radios.length).toBe(2)
		expect(radios.map((e) => e.vm.modelValue)).toEqual([false, false])

		radios[0].find('input[type="radio"]').trigger('click')
		await nextTick()
		expect(radios[0].emitted('input')?.[0]?.[0]).toBe(true)
		expect(selectedKeys.value).toEqual([1001])

		// test event
		await nextTick()
		expect(wrapper.emitted('select')?.[0]?.[0]).toEqual(true)
		expect(wrapper.emitted('select')?.[0]?.[1]).toEqual(1001)
		expect(wrapper.emitted('select')?.[0]?.[2]).toEqual(data[0])
		expect(wrapper.emitted('select')?.[0]?.[3]).instanceOf(Event)
		expect(wrapper.emitted('selectedChange')?.[0]?.[0]).toEqual([1001])

		wrapper.setProps({ selectedKeys: selectedKeys.value })
		await nextTick()
		expect(radios.map((e) => e.vm.modelValue)).toEqual([true, false])

		radios[1].find('input[type="radio"]').trigger('click')
		await nextTick()
		expect(radios[1].emitted('input')?.[0]?.[0]).toBe(true)
		expect(selectedKeys.value).toEqual([1002])

		wrapper.setProps({ selectedKeys: selectedKeys.value })
		await nextTick()
		expect(radios.map((e) => e.vm.modelValue)).toEqual([false, true])
	})
	test('multiple selection', async () => {
		const data = [
			{
				id: 1001
			},
			{
				id: 1002
			},
			{
				id: 1003,
				disabled: true
			}
		]
		const columns = [
			{
				key: 'id',
				label: 'ID',
				field: 'id'
			}
		]
		const selection = {
			multiple: true,
			showSelectAll: true,
			label: 'Select'
		}

		const selectedKeys = ref<number[]>([])

		const wrapper = mount(Table, {
			props: {
				data,
				columns,
				selection,
				'onUpdate:selectedKeys': (v) => (selectedKeys.value = v),
				selectedKeys: selectedKeys.value,
				rowKey: 'id'
			},
			attachTo: 'body'
		})

		const selectHead = wrapper.find('th')
		expect(selectHead.text()).toBe('Select')

		const firstCell = wrapper.findAll('tr').map((e) => e.find('td'))

		expect(firstCell.length).toBe(4)

		const checkboxes = wrapper.findAllComponents(Checkbox)

		expect(checkboxes.length).toBe(4)
		expect(checkboxes.map((e) => e.vm.modelValue)).toEqual([false, false, false, false])

		// select first row
		checkboxes[1].find('input[type="checkbox"]').trigger('click')
		await nextTick()
		expect(checkboxes[1].emitted('input')?.[0]?.[0]).toBe(true)
		expect(selectedKeys.value).toEqual([1001])

		// test event
		await nextTick()
		expect(wrapper.emitted('select')?.[0]?.[0]).toEqual(true)
		expect(wrapper.emitted('select')?.[0]?.[1]).toEqual(1001)
		expect(wrapper.emitted('select')?.[0]?.[2]).toEqual(data[0])
		expect(wrapper.emitted('select')?.[0]?.[3]).instanceOf(Event)
		expect(wrapper.emitted('selectedChange')?.[0]?.[0]).toEqual([1001])

		wrapper.setProps({ selectedKeys: selectedKeys.value })
		await nextTick()
		expect(checkboxes.map((e) => e.vm.modelValue)).toEqual([false, true, false, false])

		// select second row
		checkboxes[2].find('input[type="checkbox"]').trigger('click')
		await nextTick()
		expect(checkboxes[2].emitted('input')?.[0]?.[0]).toBe(true)
		expect(selectedKeys.value).toEqual([1001, 1002])

		wrapper.setProps({ selectedKeys: selectedKeys.value })
		await nextTick()
		expect(checkboxes.map((e) => e.vm.modelValue)).toEqual([true, true, true, false])

		// select all clear
		checkboxes[0].find('input[type="checkbox"]').trigger('click')
		await nextTick()
		expect(checkboxes[0].emitted('input')?.[0]?.[0]).toBe(false)
		expect(selectedKeys.value).toEqual([])

		// test event
		await nextTick()
		expect(wrapper.emitted('selectAll')?.[0]?.[0]).toEqual(false)
		expect(wrapper.emitted('selectAll')?.[0]?.[1]).instanceOf(Event)

		wrapper.setProps({ selectedKeys: selectedKeys.value })
		await nextTick()
		expect(checkboxes.map((e) => e.vm.modelValue)).toEqual([false, false, false, false])

		// select all
		checkboxes[0].find('input[type="checkbox"]').trigger('click')
		await nextTick()
		expect(checkboxes[0].emitted('input')?.[1]?.[0]).toBe(true)
		expect(selectedKeys.value).toEqual([1001, 1002])

		wrapper.setProps({ selectedKeys: selectedKeys.value })
		await nextTick()
		expect(checkboxes.map((e) => e.vm.modelValue)).toEqual([true, true, true, false])
		expect(checkboxes[0].vm.indeterminate).toBe(false)

		// select indeterminate
		checkboxes[1].find('input[type="checkbox"]').trigger('click')
		await nextTick()
		expect(checkboxes[1].emitted('input')?.[1]?.[0]).toBe(false)
		expect(selectedKeys.value).toEqual([1002])

		wrapper.setProps({ selectedKeys: selectedKeys.value })
		await nextTick()
		expect(checkboxes.map((e) => e.vm.modelValue)).toEqual([false, false, true, false])
		expect(checkboxes[0].vm.indeterminate).toBe(true)

		// select all again
		checkboxes[0].find('input[type="checkbox"]').trigger('click')
		await nextTick()
		expect(checkboxes[0].emitted('input')?.[2]?.[0]).toBe(true)
		expect(selectedKeys.value).toEqual([1002, 1001])

		wrapper.setProps({ selectedKeys: selectedKeys.value })
		await nextTick()
		expect(checkboxes.map((e) => e.vm.modelValue)).toEqual([true, true, true, false])
		expect(checkboxes[0].vm.indeterminate).toBe(false)

		// hide select all box
		selection.showSelectAll = false
		wrapper.setProps({ selection: { ...selection } })
		await nextTick()
		expect(wrapper.findAllComponents(Checkbox).length).toBe(3)
	})

	test('single selection with disabled', async () => {
		const data = [
			{
				id: 1001
			},
			{
				id: 1002,
				disabled: true
			}
		]
		const columns = [
			{
				key: 'id',
				label: 'ID',
				field: 'id'
			}
		]
		const selection = {
			multiple: false,
			label: 'Select'
		}

		const selectedKeys = ref<number[]>([])

		const wrapper = mount(Table, {
			props: {
				data,
				columns,
				selection,
				'onUpdate:selectedKeys': (v) => (selectedKeys.value = v),
				selectedKeys: selectedKeys.value,
				rowKey: 'id'
			},
			attachTo: 'body'
		})

		const radios = wrapper.findAllComponents(Radio)

		expect(radios.length).toBe(2)
		expect(radios.map((e) => e.vm.disabled)).toEqual([false, true])
	})
	test('multiple selection with disabled', async () => {
		const data = [
			{
				id: 1001
			},
			{
				id: 1002,
				disabled: true
			}
		]
		const columns = [
			{
				key: 'id',
				label: 'ID',
				field: 'id'
			}
		]
		const selection = {
			multiple: true,
			showSelectAll: true,
			label: 'Select'
		}

		const selectedKeys = ref<number[]>([])

		const wrapper = mount(Table, {
			props: {
				data,
				columns,
				selection,
				'onUpdate:selectedKeys': (v) => {
					selectedKeys.value = v
				},
				selectedKeys: selectedKeys.value,
				rowKey: 'id'
			},
			attachTo: 'body'
		})

		const checkboxes = wrapper.findAllComponents(Checkbox)

		expect(checkboxes.length).toBe(3)
		expect(checkboxes.map((e) => e.vm.disabled)).toEqual([false, false, true])

		// select all
		checkboxes[0].find('input[type="checkbox"]').trigger('click')
		await nextTick()
		expect(checkboxes[0].emitted('input')?.[0]?.[0]).toBe(true)
		await new Promise((r) => setTimeout(r))
		expect(selectedKeys.value).toEqual([1001])

		wrapper.setProps({ selectedKeys: selectedKeys.value })
		await nextTick()
		expect(checkboxes.map((e) => e.vm.modelValue)).toEqual([true, true, false])
		expect(checkboxes[0].vm.indeterminate).toBe(false)

		// select all clear
		checkboxes[0].find('input[type="checkbox"]').trigger('click')
		await new Promise((r) => setTimeout(r))
		expect(checkboxes[0].emitted('input')?.[1]?.[0]).toBe(false)
		expect(selectedKeys.value).toEqual([])

		wrapper.setProps({ selectedKeys: selectedKeys.value })
		await nextTick()
		expect(checkboxes.map((e) => e.vm.modelValue)).toEqual([false, false, false])
		expect(checkboxes[0].vm.indeterminate).toBe(false)
	})
	test('expand row', async () => {
		const keys = ['email', 'city', 'address']
		const expandRender = ({ record }: { record: TableData }) => {
			return h(
				'div',
				{},
				keys.map((e) => {
					return h('div', { style: 'display: flex; align-items: center; gap: 8px' }, [
						h('div', { style: 'color: gray; margin-right: 16px' }, e + ': '),
						h('div', {}, record[e])
					])
				})
			)
		}
		const data = [
			{
				id: 1001,
				name: 'Emma Johnson',
				email: 'emma.johnson@example.com',
				city: 'New York',
				address: '123 Main Street, Apt 4B',
				expand: expandRender
			},
			{
				id: 1002,
				name: 'James Wilson',
				email: 'j.wilson@example.com',
				city: 'Los Angeles',
				address: '456 Oak Avenue'
			}
		]
		const columns = [
			{
				key: 'id',
				label: 'ID',
				field: 'id'
			}
		]
		const expandedKeys = ref<number[]>([])
		const wrapper = mount(Table, {
			props: {
				data,
				columns,
				rowKey: 'id',
				expandable: true,
				'onUpdate:expandedKeys': (e) => (expandedKeys.value = e),
				expandedKeys: expandedKeys.value
			}
		})

		const buttons = wrapper.findAll('.px-table-icon-button')
		expect(buttons.length).toBe(1)

		buttons[0].trigger('click')
		await nextTick()
		expect(expandedKeys.value).toEqual([1001])

		wrapper.setProps({ expandedKeys: expandedKeys.value })
		await nextTick()
		const expandRow1 = wrapper.findAll('.px-table-expand-row')
		expect(expandRow1.length).toBe(1)
		expect(expandRow1[0].text()).toBe(
			'email: emma.johnson@example.comcity: New Yorkaddress: 123 Main Street, Apt 4B'
		)

		// test event
		await nextTick()
		expect(wrapper.emitted('expand')?.[0]?.[0]).toEqual(true)
		expect(wrapper.emitted('expand')?.[0]?.[1]).toEqual(1001)
		expect(wrapper.emitted('expand')?.[0]?.[2]).toEqual(data[0])
		expect(wrapper.emitted('expand')?.[0]?.[3]).instanceOf(Event)
		expect(wrapper.emitted('expandedChange')?.[0]?.[0]).toEqual([1001])

		buttons[0].trigger('click')
		await nextTick()
		expect(expandedKeys.value).toEqual([])

		wrapper.setProps({ expandedKeys: expandedKeys.value })
		await nextTick()
		const expandRow2 = wrapper.findAll('.px-table-expand-row')
		expect(expandRow2.length).toBe(0)
	})
	test('expand row with expanding all rows default', async () => {
		const keys = ['email', 'city', 'address']
		const expandRender = ({ record }: { record: TableData }) => {
			return h(
				'div',
				{},
				keys.map((e) => {
					return h('div', { style: 'display: flex; align-items: center; gap: 8px' }, [
						h('div', { style: 'color: gray; margin-right: 16px' }, e + ': '),
						h('div', {}, record[e])
					])
				})
			)
		}
		const data = [
			{
				id: 1001,
				name: 'Emma Johnson',
				email: 'emma.johnson@example.com',
				city: 'New York',
				address: '123 Main Street, Apt 4B',
				expand: expandRender
			},
			{
				id: 1002,
				name: 'James Wilson',
				email: 'j.wilson@example.com',
				city: 'Los Angeles',
				address: '456 Oak Avenue'
			}
		]
		const columns = [
			{
				key: 'id',
				label: 'ID',
				field: 'id'
			}
		]
		const expandedKeys = ref<number[]>([])
		const wrapper = mount(Table, {
			props: {
				data,
				columns,
				rowKey: 'id',
				expandable: { defaultExpandAllRows: true },
				'onUpdate:expandedKeys': (e) => (expandedKeys.value = e),
				expandedKeys: expandedKeys.value
			}
		})

		await nextTick()
		expect(expandedKeys.value).toEqual([1001])

		wrapper.setProps({ expandedKeys: expandedKeys.value })
		await nextTick()
		const expandRow = wrapper.findAll('.px-table-expand-row')
		expect(expandRow.length).toBe(1)
		expect(expandRow[0].text()).toBe(
			'email: emma.johnson@example.comcity: New Yorkaddress: 123 Main Street, Apt 4B'
		)
	})
	test('expand row with slot', async () => {
		const keys = ['email', 'city', 'address']
		const data = [
			{
				id: 1001,
				name: 'Emma Johnson',
				email: 'emma.johnson@example.com',
				city: 'New York',
				address: '123 Main Street, Apt 4B'
			},
			{
				id: 1002,
				name: 'James Wilson',
				email: 'j.wilson@example.com',
				city: 'Los Angeles',
				address: '456 Oak Avenue',
				expand: false
			}
		]
		const columns = [
			{
				key: 'id',
				label: 'ID',
				field: 'id'
			}
		]
		const expandedKeys = ref<number[]>([])
		const wrapper = mount(Table, {
			props: {
				data,
				columns,
				rowKey: 'id',
				expandable: true,
				'onUpdate:expandedKeys': (e) => (expandedKeys.value = e),
				expandedKeys: expandedKeys.value
			},
			data: () => ({
				keys
			}),
			slots: {
				expand: ({ record }) =>
					h(
						'div',
						{},
						keys.map((e) => {
							return h('div', { style: 'display: flex; align-items: center; gap: 8px' }, [
								h('div', { style: 'color: gray; margin-right: 16px' }, e + ': '),
								h('div', {}, record[e])
							])
						})
					)
			}
		})

		const buttons = wrapper.findAll('.px-table-icon-button')
		expect(buttons.length).toBe(1)

		buttons[0].trigger('click')
		await nextTick()
		expect(expandedKeys.value).toEqual([1001])

		wrapper.setProps({ expandedKeys: expandedKeys.value })
		await nextTick()
		const expandRow1 = wrapper.findAll('.px-table-expand-row')
		expect(expandRow1.length).toBe(1)

		expect(expandRow1[0].text().trim()).toBe(
			'email: emma.johnson@example.comcity: New Yorkaddress: 123 Main Street, Apt 4B'
		)

		buttons[0].trigger('click')
		await nextTick()
		expect(expandedKeys.value).toEqual([])

		wrapper.setProps({ expandedKeys: expandedKeys.value })
		await nextTick()
		const expandRow2 = wrapper.findAll('.px-table-expand-row')
		expect(expandRow2.length).toBe(0)
	})
	test('sort', async () => {
		const data = [
			{ key: 1, name: 'Olivia', age: 28, email: 'olivia@example.com' },
			{ key: 2, name: 'James', age: 32, email: 'james@example.com' },
			{ key: 3, name: 'Sophia', age: 24, email: 'sophia@example.com' },
			{ key: 4, name: 'William', age: 29, email: 'william@example.com' },
			{ key: 5, name: 'Emma', age: 31, email: 'emma@example.com' }
		]

		const columns = [
			{
				key: 'name',
				label: 'Name',
				field: 'name',
				sortable: {
					orders: ['asc', 'desc'] as const,
					sortMethod: (a: TableData, b: TableData, order: 'asc' | 'desc') => {
						const res = a.name.length - b.name.length
						return order === 'desc' ? -res : res
					},
					defaultSortOrder: 'asc' as const
				}
			},
			{
				key: 'age',
				label: 'Age',
				field: 'age',
				sortable: {
					orders: ['asc'] as const
				}
			},
			{
				key: 'email',
				label: 'Email',
				field: 'email',
				sortable: {
					orders: ['asc', 'desc'] as const
				}
			}
		]

		const sortOrder = ref<SortOrder>({})

		const wrapper = mount(Table, {
			props: {
				data,
				columns,
				sortOrder: sortOrder.value,
				'onUpdate:sortOrder': (e) => (sortOrder.value = e)
			}
		})

		const buttons = wrapper.findAll('.px-table-sort-icon-wrapper')

		expect(buttons.length).toBe(3)
		expect(wrapper.findAll('.px-table-sort-icon-wrapper__single').length).toBe(1)

		await nextTick()
		expect(sortOrder.value).toEqual({ name: 'asc' })

		wrapper.setProps({ sortOrder: sortOrder.value })
		await nextTick()

		const curData0 = wrapper
			.findAll('tbody tr')
			.map((tr) => {
				return tr
					.findAll('td')
					.map((td) => td.text())
					.join(',')
			})
			.join(';')
		expect(curData0).toBe(
			'Emma,31,emma@example.com;James,32,james@example.com;Olivia,28,olivia@example.com;Sophia,24,sophia@example.com;William,29,william@example.com'
		)

		// sort by 1st col
		buttons[0].trigger('click')
		await nextTick()
		expect(sortOrder.value).toEqual({ name: 'desc' })

		// test event
		await nextTick()
		expect(wrapper.emitted('sortOrderChange')?.[0]?.[0]).toEqual({
			name: 'desc'
		})
		expect(wrapper.emitted('sortSelect')?.[0]?.[0]).toBe('desc')
		expect(wrapper.emitted('sortSelect')?.[0]?.[1]).toBe('name')
		expect(wrapper.emitted('sortSelect')?.[0]?.[2]).toEqual(columns[0])
		expect(wrapper.emitted('sortSelect')?.[0]?.[3]).instanceOf(Event)

		wrapper.setProps({ sortOrder: sortOrder.value })
		await nextTick()

		const curData1 = wrapper
			.findAll('tbody tr')
			.map((tr) => {
				return tr
					.findAll('td')
					.map((td) => td.text())
					.join(',')
			})
			.join(';')
		expect(curData1).toBe(
			'William,29,william@example.com;Olivia,28,olivia@example.com;Sophia,24,sophia@example.com;James,32,james@example.com;Emma,31,emma@example.com'
		)

		// sort by 1st col
		buttons[0].trigger('click')
		await nextTick()
		expect(sortOrder.value).toEqual({ name: 'none' })

		wrapper.setProps({ sortOrder: sortOrder.value })
		await nextTick()

		const curData2 = wrapper
			.findAll('tbody tr')
			.map((tr) => {
				return tr
					.findAll('td')
					.map((td) => td.text())
					.join(',')
			})
			.join(';')
		expect(curData2).toBe(
			'Olivia,28,olivia@example.com;James,32,james@example.com;Sophia,24,sophia@example.com;William,29,william@example.com;Emma,31,emma@example.com'
		)

		// sort by 1st col
		buttons[0].trigger('click')
		await nextTick()
		expect(sortOrder.value).toEqual({ name: 'asc' })

		wrapper.setProps({ sortOrder: sortOrder.value })
		await nextTick()

		const curData3 = wrapper
			.findAll('tbody tr')
			.map((tr) => {
				return tr
					.findAll('td')
					.map((td) => td.text())
					.join(',')
			})
			.join(';')
		expect(curData3).toBe(curData0)

		// sort by 2nd col
		buttons[1].trigger('click')
		await nextTick()
		expect(sortOrder.value).toEqual({ name: 'none', age: 'asc' })

		wrapper.setProps({ sortOrder: sortOrder.value })
		await nextTick()

		const curData4 = wrapper
			.findAll('tbody tr')
			.map((tr) => {
				return tr
					.findAll('td')
					.map((td) => td.text())
					.join(',')
			})
			.join(';')
		expect(curData4).toBe(
			'Sophia,24,sophia@example.com;Olivia,28,olivia@example.com;William,29,william@example.com;Emma,31,emma@example.com;James,32,james@example.com'
		)

		// sort by 2nd col
		buttons[1].trigger('click')
		await nextTick()
		expect(sortOrder.value).toEqual({ name: 'none', age: 'none' })

		wrapper.setProps({ sortOrder: sortOrder.value })
		await nextTick()

		const curData5 = wrapper
			.findAll('tbody tr')
			.map((tr) => {
				return tr
					.findAll('td')
					.map((td) => td.text())
					.join(',')
			})
			.join(';')
		expect(curData5).toBe(curData2)
	})
	test('multiple sort', async () => {
		const data = [
			{ key: 1, name: 'Olivia', age: 28, email: 'olivia@example.com' },
			{ key: 2, name: 'James', age: 32, email: 'james@example.com' },
			{ key: 3, name: 'Sophia', age: 24, email: 'sophia@example.com' },
			{ key: 4, name: 'William', age: 29, email: 'william@example.com' },
			{ key: 5, name: 'Emma', age: 31, email: 'emma@example.com' }
		]
		const columns = [
			{
				key: 'name',
				label: 'Name',
				field: 'name',
				sortable: {
					orders: ['asc', 'desc'] as const,
					sortMethod: (a: TableData, b: TableData, order: 'asc' | 'desc') => {
						const res = a.name.length - b.name.length
						return order === 'desc' ? -res : res
					},
					defaultSortOrder: 'asc' as const,
					multiple: true,
					priority: 2
				}
			},
			{
				key: 'age',
				label: 'Age',
				field: 'age',
				sortable: {
					orders: ['asc'] as const,
					multiple: true
				}
			},
			{
				key: 'email',
				label: 'Email',
				field: 'email',
				sortable: {
					orders: ['asc', 'desc'] as const,
					multiple: true,
					priority: 1
				}
			}
		]
		const sortOrder = ref<SortOrder>({})
		const wrapper = mount(Table, {
			props: {
				data,
				columns,
				sortOrder: sortOrder.value,
				'onUpdate:sortOrder': (e) => (sortOrder.value = e)
			}
		})

		const buttons = wrapper.findAll('.px-table-sort-icon-wrapper')

		expect(buttons.length).toBe(3)
		expect(wrapper.findAll('.px-table-sort-icon-wrapper__single').length).toBe(1)

		await nextTick()
		expect(sortOrder.value).toEqual({ name: 'asc' })

		wrapper.setProps({ sortOrder: sortOrder.value })
		await nextTick()

		const curData0 = wrapper
			.findAll('tbody tr')
			.map((tr) => {
				return tr
					.findAll('td')
					.map((td) => td.text())
					.join(',')
			})
			.join(';')
		expect(curData0).toBe(
			'Emma,31,emma@example.com;James,32,james@example.com;Olivia,28,olivia@example.com;Sophia,24,sophia@example.com;William,29,william@example.com'
		)

		// sort by 1st col
		buttons[0].trigger('click')
		await nextTick()
		expect(sortOrder.value).toEqual({ name: 'desc' })

		// test event
		await nextTick()
		expect(wrapper.emitted('sortOrderChange')?.[0]?.[0]).toEqual({
			name: 'desc'
		})
		expect(wrapper.emitted('sortSelect')?.[0]?.[0]).toBe('desc')
		expect(wrapper.emitted('sortSelect')?.[0]?.[1]).toBe('name')
		expect(wrapper.emitted('sortSelect')?.[0]?.[2]).toEqual(columns[0])
		expect(wrapper.emitted('sortSelect')?.[0]?.[3]).instanceOf(Event)

		wrapper.setProps({ sortOrder: sortOrder.value })
		await nextTick()

		const curData1 = wrapper
			.findAll('tbody tr')
			.map((tr) => {
				return tr
					.findAll('td')
					.map((td) => td.text())
					.join(',')
			})
			.join(';')
		expect(curData1).toBe(
			'William,29,william@example.com;Olivia,28,olivia@example.com;Sophia,24,sophia@example.com;James,32,james@example.com;Emma,31,emma@example.com'
		)

		// sort by 2nd col
		buttons[1].trigger('click')
		await nextTick()
		expect(sortOrder.value).toEqual({ name: 'desc', age: 'asc' })

		wrapper.setProps({ sortOrder: sortOrder.value })
		await nextTick()

		const curData2 = wrapper
			.findAll('tbody tr')
			.map((tr) => {
				return tr
					.findAll('td')
					.map((td) => td.text())
					.join(',')
			})
			.join(';')
		expect(curData2).toBe(
			'William,29,william@example.com;Sophia,24,sophia@example.com;Olivia,28,olivia@example.com;James,32,james@example.com;Emma,31,emma@example.com'
		)

		// sort by 3rd col
		buttons[2].trigger('click')
		await nextTick()
		expect(sortOrder.value).toEqual({ age: 'asc', email: 'asc', name: 'desc' })

		wrapper.setProps({ sortOrder: sortOrder.value })
		await nextTick()

		const curData3 = wrapper
			.findAll('tbody tr')
			.map((tr) => {
				return tr
					.findAll('td')
					.map((td) => td.text())
					.join(',')
			})
			.join(';')
		expect(curData3).toBe(
			'William,29,william@example.com;Olivia,28,olivia@example.com;Sophia,24,sophia@example.com;James,32,james@example.com;Emma,31,emma@example.com'
		)
	})
	test('filter', async () => {
		const columns = [
			{
				label: 'Name',
				field: 'name',
				key: 'name'
			},
			{
				label: 'Base Salary',
				field: 'baseSalary',
				key: 'baseSalary',
				filterable: {
					filterOptions: [{ label: '>7000', value: 7000 }],
					filterMethod: (value: number[], record: TableData) => {
						return value[0] ? record.baseSalary > value[0] : true
					}
				}
			},
			{
				label: 'Bonus',
				field: 'bonus',
				key: 'bonus',
				filterable: {
					filterOptions: [{ label: '>500', value: 500 }],
					filterMethod: (value: number[], record: TableData) => {
						return value[0] ? record.bonus > value[0] : true
					}
				}
			},
			{
				label: 'Status',
				field: 'status',
				key: 'status',
				filterable: {
					multiple: true,
					filterOptions: [
						{ label: 'Active', value: 'active' },
						{ label: 'Inactive', value: 'inactive' }
					],
					defaultFilterValue: ['active']
				}
			}
		]

		const data = [
			{
				name: 'James Wilson',
				baseSalary: 8500,
				bonus: 420,
				status: 'active'
			},
			{
				name: 'Sarah Johnson',
				baseSalary: 5200,
				bonus: 780,
				status: 'inactive'
			},
			{
				name: 'Michael Brown',
				baseSalary: 11200,
				bonus: 150,
				status: 'active'
			},
			{
				name: 'Emily Davis',
				baseSalary: 3400,
				bonus: 0,
				status: 'inactive'
			},
			{
				name: 'Robert Taylor',
				baseSalary: 9800,
				bonus: 920,
				status: 'active'
			},
			{
				name: 'Jennifer Miller',
				baseSalary: 6300,
				bonus: 310,
				status: 'active'
			},
			{
				name: 'David Anderson',
				baseSalary: 7600,
				bonus: 650,
				status: 'inactive'
			},
			{
				name: 'Lisa Martinez',
				baseSalary: 4500,
				bonus: 230,
				status: 'active'
			},
			{
				name: 'William Thomas',
				baseSalary: 10500,
				bonus: 870,
				status: 'inactive'
			},
			{
				name: 'Amanda Clark',
				baseSalary: 2900,
				bonus: 0,
				status: 'active'
			}
		]

		const filterValue = ref<FilterValue>({})

		const wrapper = mount(Table, {
			props: {
				data,
				columns,
				filterValue: filterValue.value,
				'onUpdate:filterValue': (e) => (filterValue.value = e)
			},
			attachTo: 'body'
		})

		const filterControl = wrapper.findAll('.px-table-filter-icon-wrapper')
		expect(filterControl.length).toBe(3)

		await nextTick()
		expect(filterValue.value).toEqual({
			status: ['active']
		})

		wrapper.setProps({ filterValue: filterValue.value })
		await nextTick()
		const curData0 = wrapper
			.findAll('tbody tr')
			.map((tr) => {
				return tr
					.findAll('td')
					.map((td) => td.text())
					.join(',')
			})
			.join(';')
		expect(curData0).toBe(
			'James Wilson,8500,420,active;Michael Brown,11200,150,active;Robert Taylor,9800,920,active;Jennifer Miller,6300,310,active;Lisa Martinez,4500,230,active;Amanda Clark,2900,0,active'
		)

		// select 4th col's inactive
		const filterPopupWrapper0 = wrapper.findAllComponents(PopupWrapper)[2]
		filterControl[2].trigger('mouseenter')
		await new Promise((r) => setTimeout(r, 300))
		expect(filterPopupWrapper0.element.style.display).not.toBe('none')
		filterPopupWrapper0.findAllComponents(Checkbox)[1].trigger('click')
		filterPopupWrapper0.findAll('.px-button')[1].trigger('click')
		await new Promise((r) => setTimeout(r, 300))
		await expect
			.poll(() => filterPopupWrapper0.element.style.display, {
				timeout: 400
			})
			.toBe('none')
		expect(filterValue.value).toEqual({ status: ['active', 'inactive'] })

		await new Promise((r) => setTimeout(r, 500))
		wrapper.setProps({ filterValue: filterValue.value })
		await nextTick()

		const curData1 = wrapper
			.findAll('tbody tr')
			.map((tr) => {
				return tr
					.findAll('td')
					.map((td) => td.text())
					.join(',')
			})
			.join(';')
		expect(curData1).toBe(
			'James Wilson,8500,420,active;Sarah Johnson,5200,780,inactive;Michael Brown,11200,150,active;Emily Davis,3400,0,inactive;Robert Taylor,9800,920,active;Jennifer Miller,6300,310,active;David Anderson,7600,650,inactive;Lisa Martinez,4500,230,active;William Thomas,10500,870,inactive;Amanda Clark,2900,0,active'
		)

		// select 3rd col's >500
		await new Promise((r) => setTimeout(r, 100))

		const filterPopupWrapper1 = wrapper.findAllComponents(PopupWrapper)[1]
		filterControl[1].trigger('mouseenter')
		await new Promise((r) => setTimeout(r, 300))
		expect(filterPopupWrapper1.element.style.display).not.toBe('none')
		filterPopupWrapper1.findAllComponents(Radio)[0].trigger('click')
		filterPopupWrapper1.findAll('.px-button')[1].trigger('click')
		await new Promise((r) => setTimeout(r, 300))
		await expect
			.poll(() => filterPopupWrapper1.element.style.display, { timeout: 400 })
			.toBe('none')
		expect(filterValue.value).toEqual({
			bonus: [500],
			status: ['active', 'inactive']
		})

		await new Promise((r) => setTimeout(r, 500))
		wrapper.setProps({ filterValue: filterValue.value })
		await nextTick()

		const curData2 = wrapper
			.findAll('tbody tr')
			.map((tr) => {
				return tr
					.findAll('td')
					.map((td) => td.text())
					.join(',')
			})
			.join(';')
		expect(curData2).toBe(
			'Sarah Johnson,5200,780,inactive;Robert Taylor,9800,920,active;David Anderson,7600,650,inactive;William Thomas,10500,870,inactive'
		)

		// select 2nd col's >7000
		await new Promise((r) => setTimeout(r, 100))

		const filterPopupWrapper2 = wrapper.findAllComponents(PopupWrapper)[0]
		filterControl[0].trigger('mouseenter')
		await new Promise((r) => setTimeout(r, 300))
		expect(filterPopupWrapper2.element.style.display).not.toBe('none')
		filterPopupWrapper2.findAllComponents(Radio)[0].trigger('click')
		filterPopupWrapper2.findAll('.px-button')[1].trigger('click')
		await new Promise((r) => setTimeout(r, 300))
		await expect
			.poll(() => filterPopupWrapper2.element.style.display, {
				timeout: 400
			})
			.toBe('none')
		expect(filterValue.value).toEqual({
			baseSalary: [7000],
			bonus: [500],
			status: ['active', 'inactive']
		})

		await new Promise((r) => setTimeout(r, 500))
		wrapper.setProps({ filterValue: filterValue.value })
		await nextTick()

		const curData3 = wrapper
			.findAll('tbody tr')
			.map((tr) => {
				return tr
					.findAll('td')
					.map((td) => td.text())
					.join(',')
			})
			.join(';')
		expect(curData3).toBe(
			'Robert Taylor,9800,920,active;David Anderson,7600,650,inactive;William Thomas,10500,870,inactive'
		)

		// cleat 2nd col's filter
		await new Promise((r) => setTimeout(r, 100))

		filterControl[0].trigger('mouseenter')
		await new Promise((r) => setTimeout(r, 300))
		expect(filterPopupWrapper2.element.style.display).not.toBe('none')
		filterPopupWrapper2.findAll('.px-button')[0].trigger('click')
		await new Promise((r) => setTimeout(r, 300))
		await expect
			.poll(() => filterPopupWrapper2.element.style.display, { timeout: 400 })
			.toBe('none')
		expect(filterValue.value).toEqual({
			baseSalary: [],
			bonus: [500],
			status: ['active', 'inactive']
		})

		await new Promise((r) => setTimeout(r, 500))

		wrapper.setProps({ filterValue: filterValue.value })
		await nextTick()

		const curData4 = wrapper
			.findAll('tbody tr')
			.map((tr) => {
				return tr
					.findAll('td')
					.map((td) => td.text())
					.join(',')
			})
			.join(';')
		expect(curData4).toBe(curData2)

		// test event
		expect(wrapper.emitted('filterSelect')?.[0]?.[0]).toEqual(['active', 'inactive'])
		expect(wrapper.emitted('filterSelect')?.[0]?.[1]).toEqual('status')
		expect(wrapper.emitted('filterSelect')?.[0]?.[2]).toEqual({
			value: 'inactive',
			label: 'Inactive'
		})
		expect(wrapper.emitted('filterSelect')?.[0]?.[3]).toEqual(columns[3])
		expect(wrapper.emitted('filterSelect')?.[0]?.[4]).instanceOf(Event)
		expect(wrapper.emitted('filterChange')?.[0]?.[0]).toEqual({
			status: ['active', 'inactive']
		})
		expect(wrapper.emitted('filterConfirm')?.[0]?.[0]).toEqual('status')
		expect(wrapper.emitted('filterConfirm')?.[0]?.[1]).instanceOf(Event)
		expect(wrapper.emitted('filterReset')?.[0]?.[0]).toEqual('baseSalary')
		expect(wrapper.emitted('filterReset')?.[0]?.[1]).instanceOf(Event)
	})
	test('summary', async () => {
		const columns = [
			{
				label: 'Name',
				field: 'name',
				key: 'name'
			},
			{
				label: 'Base Salary',
				field: 'baseSalary',
				key: 'baseSalary'
			},
			{
				label: 'Bonus',
				field: 'bonus',
				key: 'bonus'
			},
			{
				label: 'Total',
				field: 'total',
				key: 'total'
			},
			{
				label: 'Status',
				field: 'status',
				key: 'status'
			}
		]
		const data = [
			{
				name: 'Emma Johnson',
				baseSalary: 8500,
				bonus: 420,
				total: 8920,
				status: 'active'
			},
			{
				name: 'David Smith',
				baseSalary: 6500,
				bonus: 780,
				total: 7280,
				status: 'inactive'
			},
			{
				name: 'Sophia Williams',
				baseSalary: 11200,
				bonus: 150,
				total: 11350,
				status: 'active'
			},
			{
				name: 'Michael Brown',
				baseSalary: 4200,
				bonus: 0,
				total: 4200,
				status: 'inactive'
			},
			{
				name: 'Olivia Davis',
				baseSalary: 9800,
				bonus: 920,
				total: 10720,
				status: 'active'
			},
			{
				name: 'James Wilson',
				baseSalary: 7300,
				bonus: 310,
				total: 7610,
				status: 'active'
			},
			{
				name: 'Sarah Miller',
				baseSalary: 10500,
				bonus: 850,
				total: 11350,
				status: 'inactive'
			},
			{
				name: 'Robert Taylor',
				baseSalary: 4200,
				bonus: 190,
				total: 4390,
				status: 'active'
			},
			{
				name: 'Jennifer Anderson',
				baseSalary: 8900,
				bonus: 0,
				total: 8900,
				status: 'inactive'
			},
			{
				name: 'Thomas Clark',
				baseSalary: 11500,
				bonus: 970,
				total: 12470,
				status: 'active'
			}
		]
		const summaryData = [
			{
				baseSalary: 0,
				bonus: 0,
				total: 0
			},
			{
				baseSalary: 0,
				bonus: 0,
				total: 0
			}
		]
		data.forEach((record) => {
			summaryData[0].baseSalary += record.baseSalary
			summaryData[0].bonus += record.bonus
			summaryData[0].total += record.total
		})
		summaryData[1].baseSalary = parseFloat((summaryData[0].baseSalary / data.length).toFixed(4))
		summaryData[1].bonus = parseFloat((summaryData[0].bonus / data.length).toFixed(4))
		summaryData[1].total = parseFloat((summaryData[0].total / data.length).toFixed(4))

		const summary = {
			data: summaryData,
			summaryText: ['Sum', 'Average'],
			spanMethod: ({ colIndex }: TableOptionsArg) => {
				if (colIndex === 3) {
					return {
						colspan: 2
					}
				}
			}
		} as TableSummary
		const wrapper = mount(Table, {
			props: {
				summary,
				columns,
				data
			}
		})

		const summaryRows = wrapper.findAll('tfoot tr.px-table-row__summary')
		expect(summaryRows.length).toBe(2)

		expect(wrapper.find('.px-table-foot').exists()).toBeTruthy()
		expect(wrapper.find('.px-table-foot__fixed').exists()).toBeTruthy()
		expect(summaryRows.map((tr) => tr.find('td').text())).toEqual(['Sum', 'Average'])
		expect(
			summaryRows
				.map((tr) =>
					tr
						.findAll('td')
						.map((td) => `rowspan:${td.element.rowSpan} colspan:${td.element.colSpan}`)
						.join(',')
				)
				.join(';')
		).toBe(
			'rowspan:1 colspan:1,rowspan:1 colspan:1,rowspan:1 colspan:1,rowspan:1 colspan:2;rowspan:1 colspan:1,rowspan:1 colspan:1,rowspan:1 colspan:1,rowspan:1 colspan:2'
		)

		summary.fixed = false
		wrapper.setProps({ summary: { ...summary } })
		await nextTick()
		expect(wrapper.find('.px-table-foot').exists()).toBeTruthy()
		expect(wrapper.find('.px-table-foot__fixed').exists()).toBeFalsy()

		summary.placement = 'start'
		wrapper.setProps({ summary: { ...summary } })
		await nextTick()
		expect(wrapper.find('.px-table-foot').exists()).toBeFalsy()
		expect(wrapper.find('tbody .px-table-row__summary').exists()).toBeTruthy()

		summary.fixed = true
		wrapper.setProps({ summary: { ...summary } })
		await nextTick()
		expect(wrapper.find('.px-table-foot').exists()).toBeFalsy()
		expect(wrapper.find('thead .px-table-row__summary').exists()).toBeTruthy()
		expect(wrapper.find('tbody .px-table-row__summary').exists()).toBeFalsy()
	})
	test('cell events', async () => {
		const columns = [
			{
				label: 'Basic Information',
				key: 'base-info',
				children: [
					{
						label: 'ID',
						field: 'id',
						key: 'id'
					},
					{
						label: 'Name',
						field: 'name',
						key: 'name'
					}
				]
			},
			{
				label: 'Contact Information',
				key: 'contactInformation',
				children: [
					{
						label: 'Contact Details',
						key: 'contactDetails',
						children: [
							{
								key: 'phone',
								label: 'Phone',
								field: 'phone'
							},
							{
								key: 'email',
								label: 'Email',
								field: 'email'
							}
						]
					},
					{
						label: 'Address',
						field: 'address',
						key: 'address'
					}
				]
			},
			{
				label: 'Work Information',
				key: 'workInformation',
				children: [
					{
						label: 'Department',
						field: 'department',
						key: 'department'
					},
					{
						label: 'Salary Information',
						key: 'salaryInformation',
						children: [
							{
								label: 'Base Salary',
								field: 'baseSalary',
								key: 'baseSalary'
							},
							{
								label: 'Bonus',
								field: 'bonus',
								key: 'bonus'
							},
							{
								label: 'Total',
								field: 'totalSalary',
								key: 'totalSalary'
							}
						]
					}
				]
			},
			{
				label: 'Status',
				field: 'status',
				key: 'status'
			}
		]

		const data = [
			{
				id: 1,
				name: 'John Smith',
				phone: '+1 (212) 555-0198',
				email: 'john.smith@example.com',
				address: '123 Main St, New York, NY',
				department: 'Sales',
				baseSalary: 5000,
				bonus: 1000,
				totalSalary: 6000,
				status: 'Active'
			},
			{
				id: 2,
				name: 'Emily Johnson',
				phone: '+44 20 7946 0958',
				email: 'emily.j@example.com',
				address: '456 Park Ave, Los Angeles, CA',
				department: 'Marketing',
				baseSalary: 4500,
				bonus: 800,
				totalSalary: 5300,
				status: 'Active'
			}
		]
		const wrapper = mount(Table, {
			props: {
				columns,
				data
			}
		})

		const thSample = wrapper.find('thead tr:last-of-type').find('th')
		thSample.trigger('click')
		thSample.trigger('contextmenu')
		thSample.trigger('dblclick')

		expect(wrapper.emitted('headCellClick')?.[0]?.[0]).toEqual(
			columns[1].children![0].children![0]
		)
		expect(wrapper.emitted('headCellClick')?.[0]?.[1]).toEqual([1, 0, 0])
		expect(wrapper.emitted('headCellClick')?.[0]?.[2]).instanceof(Event)

		expect(wrapper.emitted('headCellDblclick')?.[0]?.[0]).toEqual(
			columns[1].children![0].children![0]
		)
		expect(wrapper.emitted('headCellDblclick')?.[0]?.[1]).toEqual([1, 0, 0])
		expect(wrapper.emitted('headCellDblclick')?.[0]?.[2]).instanceof(Event)

		expect(wrapper.emitted('headCellContextmenu')?.[0]?.[0]).toEqual(
			columns[1].children![0].children![0]
		)
		expect(wrapper.emitted('headCellContextmenu')?.[0]?.[1]).toEqual([1, 0, 0])
		expect(wrapper.emitted('headCellContextmenu')?.[0]?.[2]).instanceof(Event)

		const tdSample = wrapper.find('tbody tr td')
		tdSample.trigger('click')
		tdSample.trigger('contextmenu')
		tdSample.trigger('dblclick')
		tdSample.trigger('mouseover')
		tdSample.trigger('mouseout')

		expect(wrapper.emitted('cellMouseenter')?.[0]?.[0]).toEqual(columns[0].children![0])
		expect(wrapper.emitted('cellMouseenter')?.[0]?.[1]).toEqual(data[0])
		expect(wrapper.emitted('cellMouseenter')?.[0]?.[2]).toEqual(0)
		expect(wrapper.emitted('cellMouseenter')?.[0]?.[3]).toEqual(0)
		expect(wrapper.emitted('cellMouseenter')?.[0]?.[4]).instanceof(Event)

		expect(wrapper.emitted('cellMouseleave')?.[0]?.[0]).toEqual(columns[0].children![0])
		expect(wrapper.emitted('cellMouseleave')?.[0]?.[1]).toEqual(data[0])
		expect(wrapper.emitted('cellMouseleave')?.[0]?.[2]).toEqual(0)
		expect(wrapper.emitted('cellMouseleave')?.[0]?.[3]).toEqual(0)
		expect(wrapper.emitted('cellMouseleave')?.[0]?.[4]).instanceof(Event)

		expect(wrapper.emitted('cellClick')?.[0]?.[0]).toEqual(columns[0].children![0])
		expect(wrapper.emitted('cellClick')?.[0]?.[1]).toEqual(data[0])
		expect(wrapper.emitted('cellClick')?.[0]?.[2]).toEqual(0)
		expect(wrapper.emitted('cellClick')?.[0]?.[3]).toEqual(0)
		expect(wrapper.emitted('cellClick')?.[0]?.[4]).instanceof(Event)

		expect(wrapper.emitted('cellDblclick')?.[0]?.[0]).toEqual(columns[0].children![0])
		expect(wrapper.emitted('cellDblclick')?.[0]?.[1]).toEqual(data[0])
		expect(wrapper.emitted('cellDblclick')?.[0]?.[2]).toEqual(0)
		expect(wrapper.emitted('cellDblclick')?.[0]?.[3]).toEqual(0)
		expect(wrapper.emitted('cellDblclick')?.[0]?.[4]).instanceof(Event)

		expect(wrapper.emitted('cellContextmenu')?.[0]?.[0]).toEqual(columns[0].children![0])
		expect(wrapper.emitted('cellContextmenu')?.[0]?.[1]).toEqual(data[0])
		expect(wrapper.emitted('cellContextmenu')?.[0]?.[2]).toEqual(0)
		expect(wrapper.emitted('cellContextmenu')?.[0]?.[3]).toEqual(0)
		expect(wrapper.emitted('cellContextmenu')?.[0]?.[4]).instanceof(Event)

		expect(wrapper.emitted('rowClick')?.[0]?.[0]).toEqual(data[0])
		expect(wrapper.emitted('rowClick')?.[0]?.[1]).toEqual(0)
		expect(wrapper.emitted('rowClick')?.[0]?.[2]).instanceof(Event)

		expect(wrapper.emitted('rowDblclick')?.[0]?.[0]).toEqual(data[0])
		expect(wrapper.emitted('rowDblclick')?.[0]?.[1]).toEqual(0)
		expect(wrapper.emitted('rowDblclick')?.[0]?.[2]).instanceof(Event)

		expect(wrapper.emitted('rowContextmenu')?.[0]?.[0]).toEqual(data[0])
		expect(wrapper.emitted('rowContextmenu')?.[0]?.[1]).toEqual(0)
		expect(wrapper.emitted('rowContextmenu')?.[0]?.[2]).instanceof(Event)
	})

	const firstNames = [
		'John',
		'Emma',
		'Michael',
		'Sarah',
		'David',
		'Lisa',
		'Robert',
		'Jennifer',
		'William',
		'Jessica',
		'James',
		'Amanda',
		'Christopher',
		'Melissa',
		'Daniel',
		'Stephanie',
		'Matthew',
		'Laura',
		'Joshua',
		'Michelle'
	]

	const lastNames = [
		'Smith',
		'Johnson',
		'Williams',
		'Brown',
		'Jones',
		'Miller',
		'Davis',
		'Garcia',
		'Rodriguez',
		'Wilson',
		'Martinez',
		'Anderson',
		'Taylor',
		'Thomas',
		'Jackson',
		'White',
		'Harris',
		'Martin',
		'Thompson',
		'Moore'
	]
	function generateRandomData(count: number, startId: number) {
		const data: any[] = []
		const currentDate = new Date()

		for (let i = 1; i <= count; i++) {
			const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
			const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
			const fullName = `${firstName} ${lastName}`

			const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`

			const randomDaysAgo = Math.floor(Math.random() * 365)
			const registerDate = new Date(currentDate)
			registerDate.setDate(registerDate.getDate() - randomDaysAgo)
			const registerDateStr = registerDate.toISOString().split('T')[0]

			data.push({
				id: i + startId,
				user: fullName,
				email: email,
				register: registerDateStr
			})
		}

		return data
	}

	test('async pagination', async () => {
		const columns = [
			{
				key: 'id',
				label: 'ID',
				field: 'id'
			},
			{
				key: 'user',
				label: 'User',
				field: 'user'
			},
			{
				key: 'email',
				label: 'Email',
				field: 'email'
			},
			{
				key: 'register',
				label: 'Register',
				field: 'register'
			}
		]

		const wrapper = mount({
			setup(_: any, { expose }: any) {
				const pageSize = ref(10)
				const page = ref(1)

				const loading = ref(false)

				const data = ref(generateRandomData(pageSize.value, pageSize.value * (page.value - 1)))

				watch([page, pageSize], () => {
					loading.value = true
					setTimeout(() => {
						data.value = generateRandomData(pageSize.value, pageSize.value * (page.value - 1))
						loading.value = false
					}, 400)
				})
				expose({
					page,
					pageSize
				})

				return () => {
					return h(Table, {
						data: data.value,
						columns,
						pagination: {
							showTotal: true,
							showJumper: true,
							showSize: true,
							total: 1000,
							paginateMethod: 'custom'
						},
						pageSize: pageSize.value,
						'onUpdate:pageSize': (e) => (pageSize.value = e),
						page: page.value,
						'onUpdate:page': (e) => (page.value = e),
						loading: loading.value
					})
				}
			}
		})

		const curData0 = wrapper.findAll('tbody tr').map((tr) => {
			return tr.findAll('td').map((td) => td.text())
		})
		wrapper.findAll('.px-pagination .px-pagination-page-item')[2].trigger('click')
		await nextTick()
		expect(wrapper.vm.page).toBe(2)
		await nextTick()
		expect(wrapper.findComponent(Spin).props('loading')).toBe(true)
		await new Promise((r) => setTimeout(r, 500))
		expect(wrapper.findComponent(Spin).props('loading')).toBe(false)

		const curData1 = wrapper.findAll('tbody tr').map((tr) => {
			return tr.findAll('td').map((td) => td.text())
		})
		expect(curData0).not.toEqual(curData1)
		expect(curData0.length).toEqual(curData1.length)

		const selectControlled = wrapper.findComponent(Select)
		await selectControlled.vm.$emit('select', 50)
		await new Promise((r) => setTimeout(r))
		expect(wrapper.vm.pageSize).toBe(50)
		await nextTick()
		expect(wrapper.findComponent(Spin).props('loading')).toBe(true)
		await new Promise((r) => setTimeout(r, 500))
		expect(wrapper.findComponent(Spin).props('loading')).toBe(false)

		const curData2 = wrapper.findAll('tbody tr').map((tr) => {
			return tr.findAll('td').map((td) => td.text())
		})
		expect(curData2.length).greaterThan(curData1.length)
	})

	test('pagination', async () => {
		const columns = [
			{
				key: 'id',
				label: 'ID',
				field: 'id'
			},
			{
				key: 'user',
				label: 'User',
				field: 'user'
			},
			{
				key: 'email',
				label: 'Email',
				field: 'email'
			},
			{
				key: 'register',
				label: 'Register',
				field: 'register'
			}
		]

		const wrapper = mount({
			setup(_: any) {
				const data = ref(generateRandomData(500, 0))

				return () => {
					return h(Table, {
						data: data.value,
						columns,
						pagination: {
							showTotal: true,
							showJumper: true,
							showSize: true,
							total: 1000
						}
					})
				}
			}
		})

		const curData0 = wrapper.findAll('tbody tr').map((tr) => {
			return tr.findAll('td').map((td) => td.text())
		})
		wrapper.findAll('.px-pagination .px-pagination-page-item')[2].trigger('click')
		await nextTick()

		const curData1 = wrapper.findAll('tbody tr').map((tr) => {
			return tr.findAll('td').map((td) => td.text())
		})
		expect(curData0).not.toEqual(curData1)
		expect(curData0.length).toEqual(curData1.length)

		const selectControlled = wrapper.findComponent(Select)
		await selectControlled.vm.$emit('select', 50)
		await new Promise((r) => setTimeout(r))

		const curData2 = wrapper.findAll('tbody tr').map((tr) => {
			return tr.findAll('td').map((td) => td.text())
		})
		expect(curData2.length).greaterThan(curData1.length)
	})

	test('select all cross page', async () => {
		const columns = [
			{
				key: 'id',
				label: 'ID',
				field: 'id'
			},
			{
				key: 'user',
				label: 'User',
				field: 'user'
			},
			{
				key: 'email',
				label: 'Email',
				field: 'email'
			},
			{
				key: 'register',
				label: 'Register',
				field: 'register'
			}
		]
		const selectAllMethod = async (
			value: boolean,
			_preState: { value: boolean; indeterminate: boolean },
			extra: {
				originData: TableData[]
				currentData: TableData[]
				paginatedData: TableData[]
				selectedKeys: any[]
				page: number
				pageSize: number
			}
		) => {
			return value ? extra.currentData.filter((e) => !e.disabled).map((e) => e.id) : []
		}
		const data = ref(generateRandomData(20, 0))
		const selectedKeys = ref<number[]>([])
		const wrapper = mount(Table, {
			props: {
				data: data.value,
				columns,
				pagination: {
					showTotal: true,
					showJumper: true,
					showSize: true,
					total: 1000
				},
				selection: {
					selectAllMethod,
					supersetSelectAllRef: 'current',
					multiple: true
				},
				selectedKeys: selectedKeys.value,
				'onUpdate:selectedKeys': (e) => {
					selectedKeys.value = e
				},
				rowKey: 'id'
			},
			attachTo: 'body'
		})

		wrapper.find('input[type="checkbox"]').trigger('click')
		await new Promise((r) => setTimeout(r))
		expect(selectedKeys.value).toEqual([
			1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
		])

		wrapper.setProps({ selectedKeys: [...selectedKeys.value] })
		await nextTick()

		wrapper.vm.select(11, false)
		expect(selectedKeys.value).toEqual([
			1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20
		])

		wrapper.setProps({ selectedKeys: [...selectedKeys.value] })
		await nextTick()
		expect(wrapper.findComponent(Checkbox).props('modelValue')).toEqual(true)
		expect(wrapper.findComponent(Checkbox).props('indeterminate')).toEqual(false)

		wrapper.setProps({
			selection: {
				selectAllMethod,
				supersetSelectAllRef: 'all',
				multiple: true
			}
		})
		await nextTick()
		expect(wrapper.findComponent(Checkbox).props('modelValue')).toEqual(false)
		expect(wrapper.findComponent(Checkbox).props('indeterminate')).toEqual(true)
	})

	test('instance methods', async () => {
		const keys = ['email', 'city', 'address']
		const expandRender = ({ record }: { record: TableData }) => {
			return h(
				'div',
				{},
				keys.map((e) => {
					return h('div', { style: 'display: flex; align-items: center; gap: 8px' }, [
						h('div', { style: 'color: gray; margin-right: 16px' }, e + ': '),
						h('div', {}, record[e])
					])
				})
			)
		}

		function generateData(count: number, startId: number = 1001) {
			const firstNames = [
				'Emma',
				'James',
				'Sophia',
				'Michael',
				'Olivia',
				'Liam',
				'Ava',
				'Noah',
				'Isabella',
				'William',
				'Mia',
				'Ethan',
				'Charlotte',
				'Alexander',
				'Amelia',
				'Benjamin',
				'Harper',
				'Daniel',
				'Evelyn',
				'Matthew'
			]
			const lastNames = [
				'Johnson',
				'Wilson',
				'Chen',
				'Brown',
				'Davis',
				'Miller',
				'Garcia',
				'Rodriguez',
				'Martinez',
				'Taylor',
				'Anderson',
				'Thomas',
				'Jackson',
				'White',
				'Harris',
				'Martin',
				'Thompson',
				'Moore',
				'Walker',
				'Clark'
			]
			const cities = [
				'New York',
				'Los Angeles',
				'Chicago',
				'Miami',
				'Seattle',
				'Houston',
				'Phoenix',
				'Philadelphia',
				'San Antonio',
				'San Diego',
				'Dallas',
				'San Jose',
				'Austin',
				'Jacksonville',
				'Fort Worth',
				'Columbus',
				'Charlotte',
				'San Francisco',
				'Indianapolis',
				'Denver'
			]
			const streetNames = [
				'Main Street',
				'Oak Avenue',
				'Pine Road',
				'Beach Boulevard',
				'Lakeview Drive',
				'Maple Lane',
				'Cedar Street',
				'Elm Avenue',
				'Hill Road',
				'Park Boulevard',
				'River Drive',
				'Sunset Avenue',
				'Mountain Road',
				'Valley Drive',
				'Ocean Boulevard',
				'Forest Lane',
				'Spring Avenue',
				'Summer Road',
				'Winter Drive',
				'Autumn Lane'
			]

			const data = []

			for (let i = 0; i < count; i++) {
				const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
				const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
				const city = cities[Math.floor(Math.random() * cities.length)]
				const streetName = streetNames[Math.floor(Math.random() * streetNames.length)]
				const streetNumber = Math.floor(Math.random() * 900) + 100

				const aptTypes = ['Apt', 'Suite', 'Unit', '#', null]
				const aptType = aptTypes[Math.floor(Math.random() * aptTypes.length)]
				const aptNumber = aptType
					? Math.floor(Math.random() * 20) +
						1 +
						(Math.random() > 0.5 ? String.fromCharCode(65 + Math.floor(Math.random() * 5)) : '')
					: ''

				let address = `${streetNumber} ${streetName}`
				if (aptType && aptNumber) {
					address += `, ${aptType} ${aptNumber}`
				}

				const item = {
					id: startId + i,
					name: `${firstName} ${lastName}`,
					email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
					city: city,
					address: address,
					expand: expandRender
				}

				data.push(item)
			}

			return data
		}

		const data = ref(generateData(50))
		// @ts-ignore
		data.value[6].disabled = true

		const columns: TableColumn[] = [
			{
				key: 'id',
				label: 'ID',
				field: 'id',
				fixed: 'left',
				sortable: {
					orders: ['asc', 'desc']
				}
			},
			{
				key: 'name',
				label: 'Name',
				field: 'name',
				filterable: {
					filterOptions: Array.from({ length: 26 }, (_, i) => ({
						label: `${String.fromCharCode(65 + i)}...`,
						value: String.fromCharCode(65 + i)
					})),
					filterMethod: (value: string[], record: TableData) => {
						if (value.length) {
							return record.name[0] === value[0]
						} else {
							return true
						}
					}
				}
			}
		]

		const expandedKeys = ref<number[]>([])
		const selectedKeys = ref<number[]>([])
		const sortOrder = ref<SortOrder>({})
		const filterValue = ref<FilterValue>({})

		const wrapper = mount(Table, {
			props: {
				data: data.value,
				columns: columns,
				rowKey: 'id',
				expandable: true,
				selectedKeys: selectedKeys.value,
				'onUpdate:selectedKeys': (e) => (selectedKeys.value = e),
				expandedKeys: expandedKeys.value,
				'onUpdate:expandedKeys': (e) => (expandedKeys.value = e),
				sortOrder: sortOrder.value,
				'onUpdate:sortOrder': (e) => (sortOrder.value = e),
				filterValue: filterValue.value,
				'onUpdate:filterValue': (e) => (filterValue.value = e),
				selection: {
					multiple: true,
					showSelectAll: true
				}
			}
		})

		expect(wrapper.vm.getCurrentData().length).toEqual(50)
		expect(wrapper.vm.getPaginatedData().length).toEqual(10)

		wrapper.vm.select([1001, 1002], true)
		await nextTick()
		expect(selectedKeys.value).toEqual([1001, 1002])
		wrapper.setProps({ selectedKeys: selectedKeys.value })
		await nextTick()

		wrapper.vm.select([1001], false)
		await nextTick()
		expect(selectedKeys.value).toEqual([1002])
		wrapper.setProps({ selectedKeys: selectedKeys.value })
		await nextTick()

		wrapper.vm.selectAll(false)
		await nextTick()
		expect(selectedKeys.value).toEqual([])
		wrapper.setProps({ selectedKeys: selectedKeys.value })
		await nextTick()

		wrapper.vm.selectAll(true)
		await nextTick()
		expect(selectedKeys.value).toEqual([1001, 1002, 1003, 1004, 1005, 1006, 1008, 1009, 1010])
		wrapper.setProps({ selectedKeys: selectedKeys.value })
		await nextTick()

		wrapper.vm.clearSelect()
		await nextTick()
		expect(selectedKeys.value).toEqual([])
		wrapper.setProps({ selectedKeys: selectedKeys.value })
		await nextTick()

		wrapper.vm.selectAll(true, true)
		await nextTick()
		expect(selectedKeys.value).toEqual([
			1001, 1002, 1003, 1004, 1005, 1006, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015, 1016,
			1017, 1018, 1019, 1020, 1021, 1022, 1023, 1024, 1025, 1026, 1027, 1028, 1029, 1030, 1031,
			1032, 1033, 1034, 1035, 1036, 1037, 1038, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046,
			1047, 1048, 1049, 1050
		])
		wrapper.setProps({ selectedKeys: selectedKeys.value })
		await nextTick()

		wrapper.vm.selectAll(true, true, false)
		await nextTick()
		expect(selectedKeys.value).toEqual([
			1001, 1002, 1003, 1004, 1005, 1006, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015, 1016,
			1017, 1018, 1019, 1020, 1021, 1022, 1023, 1024, 1025, 1026, 1027, 1028, 1029, 1030, 1031,
			1032, 1033, 1034, 1035, 1036, 1037, 1038, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046,
			1047, 1048, 1049, 1050, 1007
		])
		wrapper.setProps({ selectedKeys: selectedKeys.value })
		await nextTick()

		wrapper.vm.selectAll(false, true)
		await nextTick()
		expect(selectedKeys.value).toEqual([1007])
	})
})
