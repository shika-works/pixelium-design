import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import Table from '../index.vue'
import { h, nextTick, ref } from 'vue'
import Radio from '../../radio/index.vue'
import Checkbox from '../../checkbox/index.vue'
import { DEFAULT_ADDITION_COL_WIDTH } from '../module/share'
import type { TableData } from '../type'

describe('Table Component Example', () => {
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
})
