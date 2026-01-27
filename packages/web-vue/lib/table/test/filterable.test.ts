import { describe, it, expect, vi } from 'vitest'
import { computed, nextTick, reactive } from 'vue'
import { useFilterable } from '../module/filterable'
import type { TableData, TableColumn } from '../type'
import { buildHeaderRows } from '../module/column'

const getProps = (arg: any) => {
	return {
		data: undefined,
		columns: undefined,
		expandable: undefined,
		rowKey: undefined,
		bordered: false,
		striped: false,
		fixedHead: true,
		spanMethod: undefined,
		selectedKeys: undefined,
		defaultSelectedKeys: undefined,
		expandedKeys: undefined,
		defaultExpandedKeys: undefined,
		summary: undefined,
		filterValue: undefined,
		defaultFilterValue: undefined,
		sortOrder: undefined,
		defaultSortOrder: undefined,
		borderRadius: undefined,
		pollSizeChange: undefined,
		selection: undefined,
		...arg
	}
}

describe('Filterable Module', () => {
	const mockData: TableData[] = [
		{ id: 1, name: 'Alice', status: 'active', age: 25 },
		{ id: 2, name: 'Bob', status: 'inactive', age: 30 },
		{ id: 3, name: 'Charlie', status: 'active', age: 35 },
		{ id: 4, name: 'David', status: 'pending', age: 28 }
	]

	const mockColumns: TableColumn[] = [
		{ key: 'id', field: 'id', label: 'ID' },
		{ key: 'name', field: 'name', label: 'Name' },
		{
			key: 'status',
			field: 'status',
			label: 'Status',
			filterable: {
				filterOptions: ['active', 'inactive', 'pending'],
				multiple: true
			}
		},
		{
			key: 'age',
			field: 'age',
			label: 'Age'
		}
	]

	const getColumnsInfo = (columns: TableColumn[] = mockColumns) => {
		return computed(() => {
			const { headerRows, leafColumns, maxDepth } = buildHeaderRows(columns)
			return {
				maxDepth,
				headerRows,
				leafColumns: leafColumns as any
			}
		})
	}

	describe('useFilterable', () => {
		it('should return filterValue, filterData and genFilterableIcon', () => {
			const props = getProps({
				data: mockData,
				columns: mockColumns,
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo()

			const [filterValue, filterData, genFilterableIcon] = useFilterable(
				columnsInfo,
				props,
				emits as any
			)

			expect(filterValue).toBeDefined()
			expect(typeof filterData).toBe('function')
			expect(typeof genFilterableIcon).toBe('function')
		})

		it('should initialize with empty filterValue by default', () => {
			const props = getProps({
				data: mockData,
				columns: mockColumns,
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo()

			const [filterValue] = useFilterable(columnsInfo, props, emits as any)

			expect(filterValue.value).toEqual({})
		})

		it('should initialize with defaultFilterValue', () => {
			const defaultFilter = { status: ['active'] }
			const props = getProps({
				data: mockData,
				columns: mockColumns,
				defaultFilterValue: defaultFilter,
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo()

			const [filterValue] = useFilterable(columnsInfo, props, emits as any)

			expect(filterValue.value).toEqual(defaultFilter)
		})

		it('should apply default filter value from column definition', () => {
			const columnsWithDefault: TableColumn[] = [
				{ key: 'id', field: 'id', label: 'ID' },
				{
					key: 'status',
					field: 'status',
					label: 'Status',
					filterable: {
						filterOptions: ['active', 'inactive', 'pending'],
						multiple: true,
						defaultFilterValue: ['active']
					}
				}
			]

			const getColumnsInfoWithDefault = () => getColumnsInfo(columnsWithDefault)

			const props = getProps({
				data: mockData,
				columns: columnsWithDefault,
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfoWithDefault()

			const [filterValue] = useFilterable(columnsInfo, props, emits as any)

			expect(filterValue.value!.status).toEqual(['active'])
		})

		it('should handle null filterValue', () => {
			const props = getProps({
				data: mockData,
				columns: mockColumns,
				filterValue: null,
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo()

			const [filterValue] = useFilterable(columnsInfo, props, emits as any)

			expect(filterValue.value).toEqual({})
		})

		it('should enforce single selection when multiple is false', () => {
			const columnsWithSingleSelect: TableColumn[] = [
				{ key: 'id', field: 'id', label: 'ID' },
				{
					key: 'status',
					field: 'status',
					label: 'Status',
					filterable: {
						filterOptions: ['active', 'inactive', 'pending'],
						multiple: false
					}
				}
			]

			const getColumnsInfoSingle = () => getColumnsInfo(columnsWithSingleSelect)

			const props = getProps({
				data: mockData,
				columns: columnsWithSingleSelect,
				filterValue: { status: ['active', 'inactive'] },
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfoSingle()

			const [filterValue] = useFilterable(columnsInfo, props, emits as any)

			// Single selection should only keep first value
			expect(filterValue.value!.status).toHaveLength(1)
		})
	})

	describe('filterData', () => {
		it('should return all data when no filter is applied', () => {
			const props = getProps({
				data: mockData,
				columns: mockColumns,
				filterValue: {},
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo()

			const [, filterData] = useFilterable(columnsInfo, props, emits as any)

			expect(filterData(mockData)).toHaveLength(4)
		})

		it('should filter data based on string filter options', () => {
			const props = getProps({
				data: mockData,
				columns: mockColumns,
				filterValue: { status: ['active'] },
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo()

			const [, filterData] = useFilterable(columnsInfo, props, emits as any)

			const filtered = filterData(mockData)
			expect(filtered).toHaveLength(2)
			expect(filtered.every((row) => row.status === 'active')).toBe(true)
		})

		it('should filter data with multiple filter values', () => {
			const props = getProps({
				data: mockData,
				columns: mockColumns,
				filterValue: { status: ['active', 'inactive'] },
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo()

			const [, filterData] = useFilterable(columnsInfo, props, emits as any)

			const filtered = filterData(mockData)
			expect(filtered).toHaveLength(3)
		})

		it('should support custom filterMethod', () => {
			const columnsWithMethod: TableColumn[] = [
				{ key: 'id', field: 'id', label: 'ID' },
				{
					key: 'age',
					field: 'age',
					label: 'Age',
					filterable: {
						filterOptions: [
							{ label: '20-25', value: '20-25' },
							{ label: '25+', value: '25+' }
						],
						multiple: true,
						filterMethod: (filterValue: any[], record: TableData) => {
							if (!filterValue.length) return true
							return filterValue.some((val) => {
								if (val === '20-25') return record.age >= 20 && record.age <= 25
								if (val === '25+') return record.age > 25
								return false
							})
						}
					}
				}
			]

			const getColumnsInfoWithMethod = () => getColumnsInfo(columnsWithMethod)

			const props = getProps({
				data: mockData,
				columns: columnsWithMethod,
				filterValue: { age: ['25+'] },
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfoWithMethod()

			const [, filterData] = useFilterable(columnsInfo, props, emits as any)

			const filtered = filterData(mockData)
			expect(filtered).toHaveLength(3)
			expect(filtered.every((row) => row.age > 25)).toBe(true)
		})

		it('should return all data when filter value is empty array', () => {
			const props = getProps({
				data: mockData,
				columns: mockColumns,
				filterValue: { status: [] },
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo()

			const [, filterData] = useFilterable(columnsInfo, props, emits as any)

			expect(filterData(mockData)).toHaveLength(4)
		})

		it('should combine multiple column filters', () => {
			const columnsWithMethod: TableColumn[] = [
				{ key: 'id', field: 'id', label: 'ID' },
				{
					key: 'status',
					field: 'status',
					label: 'Status',
					filterable: {
						filterOptions: ['active', 'inactive', 'pending'],
						multiple: true
					}
				},
				{
					key: 'age',
					field: 'age',
					label: 'Age',
					filterable: {
						filterOptions: [
							{ label: '20-25', value: '20-25' },
							{ label: '25+', value: '25+' }
						],
						multiple: true,
						filterMethod: (filterValue: any[], record: TableData) => {
							if (!filterValue.length) return true
							return filterValue.some((val) => {
								if (val === '20-25') return record.age >= 20 && record.age <= 25
								if (val === '25+') return record.age > 25
								return false
							})
						}
					}
				}
			]
			const props = getProps({
				data: mockData,
				columns: columnsWithMethod,
				filterValue: { status: ['active'], age: ['25+'] },
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo()

			const [, filterData] = useFilterable(columnsInfo, props, emits as any)

			const filtered = filterData(mockData)
			expect(filtered.length).toBeGreaterThan(0)
		})
	})

	describe('Dynamic Filter Updates', () => {
		it('should sync filterValue when controlled mode changes', async () => {
			const props = reactive(
				getProps({
					data: mockData,
					columns: mockColumns,
					filterValue: { status: ['active'] },
					rowKey: 'id'
				})
			)
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo()

			const [filterValue] = useFilterable(columnsInfo, props as any, emits as any)

			expect(filterValue.value!.status).toEqual(['active'])

			// Update external filterValue
			props.filterValue = { status: ['inactive'] }

			await nextTick()
			expect(filterValue.value!.status).toEqual(['inactive'])
		})
	})

	describe('Edge Cases', () => {
		it('should handle columns without filterable property', () => {
			const columnsNoFilter: TableColumn[] = [
				{ key: 'id', field: 'id', label: 'ID' },
				{ key: 'name', field: 'name', label: 'Name' }
			]

			const getColumnsInfoNoFilter = () => getColumnsInfo(columnsNoFilter)

			const props = getProps({
				data: mockData,
				columns: columnsNoFilter,
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfoNoFilter()

			const [, filterData] = useFilterable(columnsInfo, props, emits as any)

			expect(filterData(mockData)).toEqual(mockData)
		})

		it('should handle filtering with missing field property', () => {
			const columnsNoField: TableColumn[] = [
				{ key: 'id', field: 'id', label: 'ID' },
				{
					key: 'status',
					field: undefined,
					label: 'Status',
					filterable: {
						filterOptions: ['active', 'inactive'],
						multiple: true
					}
				}
			]

			const getColumnsInfoNoField = () => getColumnsInfo(columnsNoField)

			const props = getProps({
				data: mockData,
				columns: columnsNoField,
				filterValue: { status: ['active'] },
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfoNoField()

			const [, filterData] = useFilterable(columnsInfo, props, emits as any)

			// Without field, filter returns false for all rows
			expect(filterData(mockData)).toHaveLength(0)
		})

		it('should handle empty data array', () => {
			const props = getProps({
				data: [],
				columns: mockColumns,
				filterValue: { status: ['active'] },
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo()

			const [, filterData] = useFilterable(columnsInfo, props, emits as any)

			expect(filterData([])).toHaveLength(0)
		})
	})
})
