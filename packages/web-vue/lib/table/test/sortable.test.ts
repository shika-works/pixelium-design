import { describe, it, expect, vi } from 'vitest'
import { computed } from 'vue'
import { useSortable, defaultComparator } from '../module/sortable'
import type { TableData, TableColumn, SortOrder } from '../type'
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

describe('Sortable Module', () => {
	const mockData: TableData[] = [
		{ id: 1, name: 'Alice', age: 25, salary: 5000 },
		{ id: 3, name: 'Charlie', age: 35, salary: 7000 },
		{ id: 2, name: 'Bob', age: 30, salary: 6000 },
		{ id: 4, name: 'David', age: 28, salary: 5500 }
	]

	const mockColumns: TableColumn[] = [
		{ key: 'id', field: 'id', label: 'ID' },
		{
			key: 'name',
			field: 'name',
			label: 'Name',
			sortable: {
				orders: ['asc', 'desc'],
				multiple: true
			}
		},
		{
			key: 'age',
			field: 'age',
			label: 'Age',
			sortable: {
				orders: ['asc', 'desc'],
				multiple: true
			}
		},
		{
			key: 'salary',
			field: 'salary',
			label: 'Salary',
			sortable: {
				orders: ['asc', 'desc'],
				multiple: false
			}
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

	describe('useSortable', () => {
		it('should return sortOrder, sortData and genSortableIcon', () => {
			const props = getProps({
				data: mockData,
				columns: mockColumns,
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo()

			const [sortOrder, sortData, genSortableIcon] = useSortable(
				columnsInfo,
				props,
				emits as any
			)

			expect(sortOrder).toBeDefined()
			expect(typeof sortData).toBe('function')
			expect(typeof genSortableIcon).toBe('function')
		})

		it('should initialize with empty sortOrder by default', () => {
			const props = getProps({
				data: mockData,
				columns: mockColumns,
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo()

			const [sortOrder] = useSortable(columnsInfo, props, emits as any)

			expect(sortOrder.value).toEqual({})
		})

		it('should initialize with defaultSortOrder', () => {
			const defaultSort: SortOrder = { age: 'asc' }
			const props = getProps({
				data: mockData,
				columns: mockColumns,
				defaultSortOrder: defaultSort,
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo()

			const [sortOrder] = useSortable(columnsInfo, props, emits as any)

			expect(sortOrder.value!.age).toBe('asc')
		})

		it('should apply default sort order from column definition', () => {
			const columnsWithDefault: TableColumn[] = [
				{ key: 'id', field: 'id', label: 'ID' },
				{
					key: 'name',
					field: 'name',
					label: 'Name',
					sortable: {
						orders: ['asc', 'desc'],
						multiple: true,
						defaultSortOrder: 'asc'
					}
				}
			]

			const props = getProps({
				data: mockData,
				columns: columnsWithDefault,
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo(columnsWithDefault)

			const [sortOrder] = useSortable(columnsInfo, props, emits as any)

			expect(sortOrder.value!.name).toBe('asc')
		})

		it('should handle null sortOrder', () => {
			const props = getProps({
				data: mockData,
				columns: mockColumns,
				sortOrder: null,
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo()

			const [sortOrder] = useSortable(columnsInfo, props, emits as any)

			expect(sortOrder.value).toEqual({})
		})
	})

	describe('sortData', () => {
		it('should return all data when no sort is applied', () => {
			const props = getProps({
				data: mockData,
				columns: mockColumns,
				sortOrder: {},
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo()

			const [, sortData] = useSortable(columnsInfo, props, emits as any)

			const sorted = sortData([...mockData])
			expect(sorted).toHaveLength(4)
		})

		it('should sort data in ascending order', () => {
			const props = getProps({
				data: mockData,
				columns: mockColumns,
				sortOrder: { age: 'asc' },
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo()

			const [, sortData] = useSortable(columnsInfo, props, emits as any)

			const sorted = sortData([...mockData])
			expect(sorted[0].age).toBe(25)
			expect(sorted[1].age).toBe(28)
			expect(sorted[2].age).toBe(30)
			expect(sorted[3].age).toBe(35)
		})

		it('should sort data in descending order', () => {
			const props = getProps({
				data: mockData,
				columns: mockColumns,
				sortOrder: { age: 'desc' },
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo()

			const [, sortData] = useSortable(columnsInfo, props, emits as any)

			const sorted = sortData([...mockData])
			expect(sorted[0].age).toBe(35)
			expect(sorted[1].age).toBe(30)
			expect(sorted[2].age).toBe(28)
			expect(sorted[3].age).toBe(25)
		})

		it('should support custom sortMethod', () => {
			const columnsWithMethod: TableColumn[] = [
				{ key: 'id', field: 'id', label: 'ID' },
				{
					key: 'name',
					field: 'name',
					label: 'Name',
					sortable: {
						orders: ['asc', 'desc'],
						multiple: true,
						sortMethod: (a: TableData, b: TableData, order: 'asc' | 'desc') => {
							// Sort by name length instead of alphabetically
							const aLen = (a.name as string).length
							const bLen = (b.name as string).length
							const result = aLen > bLen ? 1 : aLen < bLen ? -1 : 0
							return order === 'desc' ? -result : result
						}
					}
				}
			]

			const props = getProps({
				data: mockData,
				columns: columnsWithMethod,
				sortOrder: { name: 'asc' },
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo(columnsWithMethod)

			const [, sortData] = useSortable(columnsInfo, props, emits as any)

			const sorted = sortData([...mockData])
			expect(sorted[0].name).toBe('Bob') // length 3
		})

		it('should return data unchanged when sortOrder is none', () => {
			const props = getProps({
				data: mockData,
				columns: mockColumns,
				sortOrder: { age: 'none' },
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo()

			const [, sortData] = useSortable(columnsInfo, props, emits as any)

			const sorted = sortData([...mockData])
			expect(sorted).toHaveLength(4)
		})

		it('should handle numeric sorting correctly', () => {
			const props = getProps({
				data: mockData,
				columns: mockColumns,
				sortOrder: { salary: 'asc' },
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo()

			const [, sortData] = useSortable(columnsInfo, props, emits as any)

			const sorted = sortData([...mockData])
			expect(sorted[0].salary).toBe(5000)
			expect(sorted[1].salary).toBe(5500)
			expect(sorted[2].salary).toBe(6000)
			expect(sorted[3].salary).toBe(7000)
		})

		it('should handle string sorting correctly', () => {
			const props = getProps({
				data: mockData,
				columns: mockColumns,
				sortOrder: { name: 'asc' },
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo()

			const [, sortData] = useSortable(columnsInfo, props, emits as any)

			const sorted = sortData([...mockData])
			expect(sorted[0].name).toBe('Alice')
			expect(sorted[1].name).toBe('Bob')
			expect(sorted[2].name).toBe('Charlie')
			expect(sorted[3].name).toBe('David')
		})
	})

	describe('Sort Icon Generation', () => {
		it('should return null when orders is empty', () => {
			const columnsNoOrders: TableColumn[] = [
				{
					key: 'name',
					field: 'name',
					label: 'Name',
					sortable: {
						orders: [],
						multiple: true
					}
				}
			]

			const props = getProps({
				data: mockData,
				columns: columnsNoOrders,
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo(columnsNoOrders)

			const [, , genSortableIcon] = useSortable(columnsInfo, props, emits as any)

			const sortIcon = genSortableIcon(columnsNoOrders[0].sortable!, columnsNoOrders[0])
			expect(sortIcon).toBeNull()
		})
	})

	describe('Sort Order Validation', () => {
		it('should validate sort order against allowed orders', () => {
			const columnsLimitedOrders: TableColumn[] = [
				{
					key: 'age',
					field: 'age',
					label: 'Age',
					sortable: {
						orders: ['asc'],
						multiple: true
					}
				}
			]

			const props = getProps({
				data: mockData,
				columns: columnsLimitedOrders,
				sortOrder: { age: 'desc' },
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo(columnsLimitedOrders)

			const [sortOrder] = useSortable(columnsInfo, props, emits as any)

			expect(sortOrder.value).toBeDefined()
		})

		it('should handle columns without sortable property', () => {
			const columnsWithoutSort: TableColumn[] = [
				{ key: 'id', field: 'id', label: 'ID' },
				{ key: 'name', field: 'name', label: 'Name' }
			]

			const props = getProps({
				data: mockData,
				columns: columnsWithoutSort,
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = computed(() => ({
				maxDepth: 1,
				headerRows: [[]],
				leafColumns: [] as any
			}))

			const [, sortData] = useSortable(columnsInfo, props, emits as any)

			expect(sortData([...mockData])).toEqual(mockData)
		})
	})

	describe('defaultComparator', () => {
		it('should compare numbers correctly in ascending order', () => {
			const a = { field: 10 } as TableData
			const b = { field: 20 } as TableData

			const result = defaultComparator(a, b, 'asc', 'field')

			expect(result).toBeLessThan(0)
		})

		it('should compare numbers correctly in descending order', () => {
			const a = { field: 10 } as TableData
			const b = { field: 20 } as TableData

			const result = defaultComparator(a, b, 'desc', 'field')

			expect(result).toBeGreaterThan(0)
		})

		it('should compare strings correctly in ascending order', () => {
			const a = { name: 'Alice' } as TableData
			const b = { name: 'Bob' } as TableData

			const result = defaultComparator(a, b, 'asc', 'name')

			expect(result).toBeLessThan(0)
		})

		it('should compare strings correctly in descending order', () => {
			const a = { name: 'Alice' } as TableData
			const b = { name: 'Bob' } as TableData

			const result = defaultComparator(a, b, 'desc', 'name')

			expect(result).toBeGreaterThan(0)
		})

		it('should return 0 for equal values', () => {
			const a = { field: 10 } as TableData
			const b = { field: 10 } as TableData

			const result = defaultComparator(a, b, 'asc', 'field')

			expect(result).toBe(0)
		})

		it('should return 0 when field is undefined', () => {
			const a = { field: 10 } as TableData
			const b = { field: 20 } as TableData

			const result = defaultComparator(a, b, 'asc', undefined)

			expect(result).toBe(0)
		})

		it('should handle missing field property', () => {
			const a = { other: 10 } as TableData
			const b = { other: 20 } as TableData

			const result = defaultComparator(a, b, 'asc', 'field')

			expect(result).toBe(0)
		})
	})

	describe('Edge Cases', () => {
		it('should handle empty data array', () => {
			const props = getProps({
				data: [],
				columns: mockColumns,
				sortOrder: { age: 'asc' },
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo()

			const [, sortData] = useSortable(columnsInfo, props, emits as any)

			expect(sortData([])).toHaveLength(0)
		})

		it('should handle single row data', () => {
			const singleRow: TableData[] = [{ id: 1, name: 'Alice', age: 25, salary: 5000 }]

			const props = getProps({
				data: singleRow,
				columns: mockColumns,
				sortOrder: { age: 'asc' },
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo()

			const [, sortData] = useSortable(columnsInfo, props, emits as any)

			expect(sortData([...singleRow])).toHaveLength(1)
		})

		it('should handle duplicate values in sort field', () => {
			const dataWithDuplicates: TableData[] = [
				{ id: 1, name: 'Alice', age: 25, salary: 5000 },
				{ id: 2, name: 'Bob', age: 25, salary: 5000 },
				{ id: 3, name: 'Charlie', age: 25, salary: 5000 }
			]

			const props = getProps({
				data: dataWithDuplicates,
				columns: mockColumns,
				sortOrder: { age: 'asc' },
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo()

			const [, sortData] = useSortable(columnsInfo, props, emits as any)

			const sorted = sortData([...dataWithDuplicates])
			expect(sorted).toHaveLength(3)
			expect(sorted.every((r) => r.age === 25)).toBe(true)
		})

		it('should handle null and undefined values', () => {
			const dataWithNulls: TableData[] = [
				{ id: 1, name: 'Alice', age: 25, salary: 5000 },
				{ id: 2, name: 'Bob', age: null, salary: 6000 } as any,
				{ id: 3, name: 'Charlie', age: undefined, salary: 7000 } as any
			]

			const props = getProps({
				data: dataWithNulls,
				columns: mockColumns,
				sortOrder: { age: 'asc' },
				rowKey: 'id'
			})
			const emits = vi.fn()
			const columnsInfo = getColumnsInfo()

			const [, sortData] = useSortable(columnsInfo, props, emits as any)

			expect(sortData([...dataWithNulls])).toHaveLength(3)
		})
	})
})
