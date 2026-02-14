import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Table from '../index.vue'
import type { TableColumn, TableData } from '../type'
import { nextTick } from 'vue'

describe('Table Component', () => {
	const mockData: TableData[] = [
		{ key: 1, name: 'Alice', age: 25, email: 'alice@example.com' },
		{ key: 2, name: 'Bob', age: 30, email: 'bob@example.com' },
		{ key: 3, name: 'Charlie', age: 35, email: 'charlie@example.com' }
	]

	const mockColumns: TableColumn[] = [
		{
			key: 'name',
			label: 'Name',
			field: 'name',
			width: 100
		},
		{
			key: 'age',
			label: 'Age',
			field: 'age',
			width: 80
		},
		{
			key: 'email',
			label: 'Email',
			field: 'email',
			width: 150
		}
	]

	describe('Basic Rendering', () => {
		it('should render table component', () => {
			const wrapper = mount(Table, {
				props: {
					data: mockData,
					columns: mockColumns
				}
			})
			expect(wrapper.exists()).toBe(true)
			expect(wrapper.find('table').exists()).toBe(true)
		})

		it('should render table with correct number of rows', () => {
			const wrapper = mount(Table, {
				props: {
					data: mockData,
					columns: mockColumns
				}
			})
			const rows = wrapper.findAll('tbody tr')
			expect(rows.length).toBe(mockData.length)
		})

		it('should render table with correct number of columns', () => {
			const wrapper = mount(Table, {
				props: {
					data: mockData,
					columns: mockColumns
				}
			})
			const headerCells = wrapper.findAll('thead th')
			expect(headerCells.length).toBeGreaterThan(0)
		})

		it('should render empty state when data is empty', () => {
			const wrapper = mount(Table, {
				props: {
					data: [],
					columns: mockColumns
				}
			})
			expect(wrapper.find('.px-empty').element).toBeDefined()
		})

		it('should render table with no columns', () => {
			const wrapper = mount(Table, {
				props: {
					data: mockData,
					columns: []
				}
			})
			expect(wrapper.find('thead th').exists()).toBe(true)
		})
	})

	describe('Props', () => {
		it('should accept bordered prop', () => {
			const wrapper = mount(Table, {
				props: {
					data: mockData,
					columns: mockColumns,
					bordered: true
				}
			})
			expect(wrapper.find('.px-table-area').element.className).include('px-table__col-bordered')
			expect(wrapper.find('.px-table-area').element.className).include('px-table__row-bordered')
			expect(wrapper.find('.px-table-area').element.className).include('px-table__bordered')
			expect(wrapper.find('.px-table-area').element.className).include(
				'px-table__head-bordered'
			)
			expect(wrapper.find('.px-table-area').element.className).include(
				'px-table__side-bordered'
			)
		})

		it('should accept bordered object prop', () => {
			const wrapper = mount(Table, {
				props: {
					data: mockData,
					columns: mockColumns,
					bordered: {
						table: true,
						row: false,
						col: true,
						head: true,
						side: false
					}
				}
			})
			expect(wrapper.find('.px-table-area.px-table__col-bordered').exists()).toBeTruthy()
			expect(wrapper.find('.px-table-area.px-table__row-bordered').exists()).not.toBeTruthy()
			expect(wrapper.find('.px-table-area.px-table__bordered').exists()).toBeTruthy()
			expect(wrapper.find('.px-table-area.px-table__side-bordered').exists()).not.toBeTruthy()
			expect(wrapper.find('.px-table-area.px-table__head-bordered').exists()).toBeTruthy()
		})

		it('should accept variant prop', async () => {
			const wrapper = mount(Table, {
				props: {
					data: mockData,
					columns: mockColumns,
					variant: 'striped'
				}
			})
			expect(wrapper.find('.px-table__striped').exists()).toBeTruthy()

			wrapper.setProps({
				variant: 'checkered'
			})
			await nextTick()
			expect(wrapper.find('.px-table__checkered').exists()).toBeTruthy()

			wrapper.setProps({
				variant: 'normal'
			})
			await nextTick()
			expect(wrapper.find('.px-table__striped').exists()).not.toBeTruthy()
			expect(wrapper.find('.px-table__checkered').exists()).not.toBeTruthy()
		})

		it('should accept fixedHead prop', async () => {
			const wrapper = mount(Table, {
				props: {
					data: mockData,
					columns: mockColumns
				}
			})
			expect(wrapper.find('.px-table__head-sticky').exists()).toBeTruthy()
			wrapper.setProps({ fixedHead: false })
			await nextTick()
			expect(wrapper.find('.px-table__head-sticky').exists()).not.toBeTruthy()
		})
		it('should accept numeric scroll.x and set wrapper width in px', () => {
			const wrapper = mount(Table, {
				props: {
					data: mockData,
					columns: mockColumns,
					scroll: { x: 500 }
				}
			})
			const wrapperDiv = wrapper.find('.px-table-wrapper')
			expect(wrapperDiv.exists()).toBe(true)
			expect(wrapperDiv.attributes('style') || '').toContain('width: 500px')
		})

		it('should accept string scroll.x (e.g., vw) and set wrapper width accordingly', () => {
			const wrapper = mount(Table, {
				props: {
					data: mockData,
					columns: mockColumns,
					scroll: { x: '50vw' }
				}
			})
			const wrapperDiv = wrapper.find('.px-table-wrapper')
			expect(wrapperDiv.exists()).toBe(true)
			expect(wrapperDiv.attributes('style') || '').toContain('width: 50vw')
		})
	})

	describe('Column Configuration', () => {
		it('should render columns with custom widths', () => {
			const columns: TableColumn[] = [
				{
					key: 'name',
					label: 'Name',
					field: 'name',
					width: 200
				},
				{
					key: 'age',
					label: 'Age',
					field: 'age',
					width: 100
				}
			]

			const wrapper = mount(Table, {
				props: {
					data: mockData,
					columns: columns
				}
			})
			const headerCells = wrapper.findAll('thead th')
			expect(headerCells[0].attributes('style') || '').toContain('width: 200px')
			expect(headerCells[1].attributes('style') || '').toContain('width: 100px')
		})

		it('should render columns with minWidth', () => {
			const columns: TableColumn[] = [
				{
					key: 'name',
					label: 'Name',
					field: 'name',
					minWidth: 100
				}
			]

			const wrapper = mount(Table, {
				props: {
					data: mockData,
					columns: columns
				}
			})
			const headerCell = wrapper.find('thead th')

			expect(headerCell.attributes('style') || '').toContain('min-width: 100px')
		})

		it('should render columns with custom alignment', () => {
			const columns: TableColumn[] = [
				{
					key: 'name',
					label: 'Name',
					field: 'name',
					align: 'center'
				}
			]

			const wrapper = mount(Table, {
				props: {
					data: mockData,
					columns: columns
				}
			})
			const bodyCellDiv = wrapper.find('tbody td div')
			expect(bodyCellDiv.attributes('style') || '').toContain('text-align: center')
		})

		it('should render fixed columns', () => {
			const columns: TableColumn[] = [
				{
					key: 'name',
					label: 'Name',
					field: 'name',
					fixed: 'left'
				},
				{
					key: 'age',
					label: 'Age',
					field: 'age',
					fixed: 'right'
				}
			]

			const wrapper = mount(Table, {
				props: {
					data: mockData,
					columns: columns
				}
			})
			const headerCells = wrapper.findAll('thead th')
			expect(headerCells[0].classes()).toContain('px-table-th__left-fixed')
			expect(headerCells[1].classes()).toContain('px-table-th__right-fixed')
		})

		it('should render nested columns', () => {
			const columns: TableColumn[] = [
				{
					key: 'personal',
					label: 'Personal Info',
					children: [
						{
							key: 'name',
							label: 'Name',
							field: 'name'
						},
						{
							key: 'age',
							label: 'Age',
							field: 'age'
						}
					]
				},
				{
					key: 'email',
					label: 'Email',
					field: 'email'
				}
			]

			const wrapper = mount(Table, {
				props: {
					data: mockData,
					columns: columns
				}
			})
			const headerRows = wrapper.findAll('thead tr')
			expect(headerRows.length).toBeGreaterThan(1)
			expect(headerRows[0].text()).toContain('Personal Info')
		})
	})

	describe('Data Update', () => {
		it('should update table when data prop changes', async () => {
			const wrapper = mount(Table, {
				props: {
					data: mockData,
					columns: mockColumns
				}
			})

			const initialRows = wrapper.findAll('tbody tr').length
			expect(initialRows).toBe(3)

			const newData = [{ key: 4, name: 'David', age: 28, email: 'david@example.com' }]

			await wrapper.setProps({ data: newData })
			await flushPromises()

			const updatedRows = wrapper.findAll('tbody tr').length
			expect(updatedRows).toBe(1)
		})

		it('should update table when columns prop changes', async () => {
			const wrapper = mount(Table, {
				props: {
					data: mockData,
					columns: mockColumns
				}
			})

			const newColumns: TableColumn[] = [
				{
					key: 'name',
					label: 'Name',
					field: 'name'
				}
			]

			await wrapper.setProps({ columns: newColumns })
			await flushPromises()
			const leafHeaders = wrapper.findAll('thead .px-table-last-head-row th')
			expect(leafHeaders.length).toBe(1)
		})
	})

	describe('SpanMethod', () => {
		it('should accept spanMethod prop', () => {
			const spanMethod = vi.fn(({ rowIndex, colIndex }) => {
				if (rowIndex === 0 && colIndex === 0) return { colspan: 2 }
			})

			const wrapper = mount(Table, {
				props: {
					data: mockData,
					columns: mockColumns,
					spanMethod: spanMethod
				}
			})

			expect(spanMethod).toHaveBeenCalled()
			const firstRowTds = wrapper.findAll('tbody tr')[0].findAll('td')
			// original 3 leaf columns, colspan 2 should reduce rendered TD count by 1
			expect(firstRowTds.length).toBeLessThanOrEqual(3)
			const spanned = wrapper.find('tbody td[colspan]')
			expect(spanned.exists()).toBe(true)
			expect(spanned.attributes('colspan')).toBe('2')
		})
	})

	describe('Rendering Method', () => {
		it('should render columns with custom render function', () => {
			const columns: TableColumn[] = [
				{
					key: 'name',
					label: 'Name',
					render: (arg) => `CUSTOM:${arg.record.name}`
				}
			]

			const wrapper = mount(Table, {
				props: {
					data: mockData,
					columns: columns
				}
			})

			const firstCell = wrapper.find('tbody tr td div')
			expect(firstCell.text()).toContain('CUSTOM:Alice')
		})

		it('should render columns with slotName', () => {
			const columns: TableColumn[] = [
				{
					key: 'name',
					label: 'Name',
					slotName: 'nameSlot'
				}
			]

			const wrapper = mount(Table, {
				props: {
					data: mockData,
					columns: columns
				},
				slots: {
					nameSlot: '<span>Custom Cell</span>'
				}
			})
			const cell = wrapper.find('tbody tr td div')
			expect(cell.html()).toContain('Custom Cell')
		})
	})
})
