import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import Table from '../index.vue'
import { h, nextTick, ref } from 'vue'
import Radio from '../../radio/index.vue'
import Checkbox from '../../checkbox/index.vue'
import { DEFAULT_ADDITION_COL_WIDTH } from '../module/share'
import type { FilterValue, SortOrder, TableData } from '../type'
import PopupWrapper from '../../popup-wrapper/index.vue'
import { createMocks } from '../../share/util/test'

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

		expect(wrapper.classes()).include('px-table__hierarchical-head')

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

		expect(firstCell.length).toBe(3)

		const checkboxes = wrapper.findAllComponents(Checkbox)

		expect(checkboxes.length).toBe(3)
		expect(checkboxes.map((e) => e.vm.modelValue)).toEqual([false, false, false])

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
		expect(checkboxes.map((e) => e.vm.modelValue)).toEqual([false, true, false])

		// select second row
		checkboxes[2].find('input[type="checkbox"]').trigger('click')
		await nextTick()
		expect(checkboxes[2].emitted('input')?.[0]?.[0]).toBe(true)
		expect(selectedKeys.value).toEqual([1001, 1002])

		wrapper.setProps({ selectedKeys: selectedKeys.value })
		await nextTick()
		expect(checkboxes.map((e) => e.vm.modelValue)).toEqual([true, true, true])

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
		expect(checkboxes.map((e) => e.vm.modelValue)).toEqual([false, false, false])

		// select all
		checkboxes[0].find('input[type="checkbox"]').trigger('click')
		await nextTick()
		expect(checkboxes[0].emitted('input')?.[1]?.[0]).toBe(true)
		expect(selectedKeys.value).toEqual([1001, 1002])

		wrapper.setProps({ selectedKeys: selectedKeys.value })
		await nextTick()
		expect(checkboxes.map((e) => e.vm.modelValue)).toEqual([true, true, true])
		expect(checkboxes[0].vm.indeterminate).toBe(false)

		// select indeterminate
		checkboxes[1].find('input[type="checkbox"]').trigger('click')
		await nextTick()
		expect(checkboxes[1].emitted('input')?.[1]?.[0]).toBe(false)
		expect(selectedKeys.value).toEqual([1002])

		wrapper.setProps({ selectedKeys: selectedKeys.value })
		await nextTick()
		expect(checkboxes.map((e) => e.vm.modelValue)).toEqual([false, false, true])
		expect(checkboxes[0].vm.indeterminate).toBe(true)

		// select all again
		checkboxes[0].find('input[type="checkbox"]').trigger('click')
		await nextTick()
		expect(checkboxes[0].emitted('input')?.[2]?.[0]).toBe(true)
		expect(selectedKeys.value).toEqual([1002, 1001])

		wrapper.setProps({ selectedKeys: selectedKeys.value })
		await nextTick()
		expect(checkboxes.map((e) => e.vm.modelValue)).toEqual([true, true, true])
		expect(checkboxes[0].vm.indeterminate).toBe(false)

		// hide select all box
		selection.showSelectAll = false
		wrapper.setProps({ selection: { ...selection } })
		await nextTick()
		expect(wrapper.findAllComponents(Checkbox).length).toBe(2)
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
				'onUpdate:selectedKeys': (v) => (selectedKeys.value = v),
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
		expect(selectedKeys.value).toEqual([1001])

		wrapper.setProps({ selectedKeys: selectedKeys.value })
		await nextTick()
		expect(checkboxes.map((e) => e.vm.modelValue)).toEqual([true, true, false])
		expect(checkboxes[0].vm.indeterminate).toBe(false)

		// select all clear
		checkboxes[0].find('input[type="checkbox"]').trigger('click')
		await nextTick()
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
		expect(filterPopupWrapper0.element.style.display).toBe('none')
		expect(filterValue.value).toEqual({ status: ['active', 'inactive'] })

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
		expect(filterPopupWrapper1.element.style.display).toBe('none')
		expect(filterValue.value).toEqual({
			bonus: [500],
			status: ['active', 'inactive']
		})

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
		expect(filterPopupWrapper2.element.style.display).toBe('none')
		expect(filterValue.value).toEqual({
			baseSalary: [7000],
			bonus: [500],
			status: ['active', 'inactive']
		})

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
		expect(filterPopupWrapper2.element.style.display).toBe('none')
		expect(filterValue.value).toEqual({
			baseSalary: [],
			bonus: [500],
			status: ['active', 'inactive']
		})

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
	})
})
