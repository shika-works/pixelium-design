import { describe, it, expect, vi } from 'vitest'
import { useExpandable } from '../module/expandable'
import type { TableData } from '../type'
import { reactive } from 'vue'

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

describe('Expandable Module', () => {
	const mockData: TableData[] = [
		{ key: 1, name: 'Alice', expand: '<p>Details for Alice</p>' },
		{ key: 2, name: 'Bob', expand: '<p>Details for Bob</p>' },
		{ key: 3, name: 'Charlie' }
	]

	describe('useExpandable', () => {
		it('should return expandedKeys and genExpandableCol function', () => {
			const props = getProps({
				data: mockData,
				columns: [],
				expandable: { width: 40 },
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [expandedKeys, genExpandableCol] = useExpandable(props, emits as any, {})

			expect(expandedKeys).toBeDefined()
			expect(typeof genExpandableCol).toBe('function')
		})

		it('should initialize with empty expandedKeys by default', () => {
			const props = getProps({
				data: mockData,
				columns: [],
				expandable: { width: 40 },
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [expandedKeys] = useExpandable(props, emits as any, {})

			expect(expandedKeys.value).toEqual([])
		})

		it('should generate expandableConfig correctly for boolean expandable', () => {
			const props = getProps({
				data: mockData,
				columns: [],
				expandable: true,
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [, , expandableConfig] = useExpandable(props, emits as any, {})

			expect(expandableConfig.value.defaultExpandAllRows).toBe(false)
			expect(expandableConfig.value.label).toBeUndefined()
			expect(expandableConfig.value.width).toBeUndefined()
			expect(expandableConfig.value.minWidth).toBeUndefined()
			expect(expandableConfig.value.fixed).toBe(false)
		})

		it('should generate expandableConfig correctly for object expandable', () => {
			const props = getProps({
				data: mockData,
				columns: [],
				expandable: {
					defaultExpandAllRows: true,
					label: 'Exp',
					width: 50,
					minWidth: 30,
					fixed: true
				},
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [, , expandableConfig] = useExpandable(props, emits as any, {})

			expect(expandableConfig.value.defaultExpandAllRows).toBe(true)
			expect(expandableConfig.value.label).toBe('Exp')
			expect(expandableConfig.value.width).toBe(50)
			expect(expandableConfig.value.minWidth).toBe(30)
			expect(expandableConfig.value.fixed).toBe(true)
		})

		it('should initialize with defaultExpandedKeys', () => {
			const props = getProps({
				data: mockData,
				columns: [],
				expandable: { width: 40 },
				defaultExpandedKeys: [1, 2],
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [expandedKeys] = useExpandable(props, emits as any, {})

			expect(expandedKeys.value).toContain(1)
			expect(expandedKeys.value).toContain(2)
		})

		it('should handle null expandedKeys', () => {
			const props = getProps({
				data: mockData,
				columns: [],
				expandable: { width: 40 },
				expandedKeys: null,
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [expandedKeys] = useExpandable(props, emits as any, {})

			expect(expandedKeys.value).toEqual([])
		})

		it('should auto expand all rows when defaultExpandAllRows is true', () => {
			const props = getProps({
				data: mockData,
				columns: [],
				expandable: { defaultExpandAllRows: true },
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [expandedKeys] = useExpandable(props, emits as any, {})

			// Should expand rows with expand property
			const rowsWithExpand = mockData.filter((d) => d.expand !== undefined)
			rowsWithExpand.forEach((row) => {
				expect(expandedKeys.value).toContain(row.key)
			})
		})
	})

	describe('genExpandableCol', () => {
		it('should generate an expandable column', () => {
			const props = getProps({
				data: mockData,
				columns: [],
				expandable: { width: 40 },
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [, genExpandableCol] = useExpandable(props, emits as any, {})
			const expandableCol = genExpandableCol({ width: 40 }, props.columns)

			expect(expandableCol).toBeDefined()
			expect(expandableCol.key).toBeDefined()
			expect(expandableCol.width).toBe(40)
		})

		it('should use default width when not specified', () => {
			const props = getProps({
				data: mockData,
				columns: [],
				expandable: {},
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [, genExpandableCol] = useExpandable(props, emits as any, {})
			const expandableCol = genExpandableCol({}, props.columns)

			expect(expandableCol.width).toBeDefined()
			expect(expandableCol.width).toBeGreaterThan(0)
		})

		it('should handle expandable column with fixed position', () => {
			const props = getProps({
				data: mockData,
				columns: [],
				expandable: { width: 40 },
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [, genExpandableCol] = useExpandable(props, emits as any, {})
			const expandableCol = genExpandableCol({ width: 40 }, props.columns)

			expect(['left', 'right', 'none']).toContain(expandableCol.fixed)
		})

		it('should fix expandable column to left when there are left-fixed columns', () => {
			const props = getProps({
				data: mockData,
				columns: [{ key: 'name', label: 'Name', fixed: 'left' }],
				expandable: { width: 40 },
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [, genExpandableCol] = useExpandable(props, emits as any, {})
			const expandableCol = genExpandableCol({ width: 40 }, props.columns)

			expect(expandableCol.fixed).toBe('left')
		})

		it('should handle minWidth property', () => {
			const props = getProps({
				data: mockData,
				columns: [],
				expandable: { width: 40, minWidth: 35 },
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [, genExpandableCol] = useExpandable(props, emits as any, {})
			const expandableCol = genExpandableCol({ width: 40, minWidth: 35 }, props.columns!)

			expect(expandableCol.width).toBe(40)
		})
	})

	describe('Data Changes', () => {
		it('should handle data updates', async () => {
			const props = reactive(
				getProps({
					data: mockData,
					columns: [],
					expandable: { width: 40 },
					defaultExpandedKeys: [1],
					rowKey: 'key'
				})
			)

			const emits = vi.fn()

			const [expandedKeys] = useExpandable(props as any, emits as any, {})

			expect(expandedKeys.value).toContain(1)

			// Update data
			props.data.value = [{ key: 1, name: 'Alice', expand: 'test' }]

			// expandedKeys should be preserved
			expect(expandedKeys.value).toContain(1)
		})
	})

	describe('Fixed Position Logic', () => {
		it('should not fix expandable column when no left-fixed columns exist', () => {
			const props = getProps({
				data: mockData,
				columns: [
					{ key: 'name', label: 'Name' },
					{ key: 'age', label: 'Age' }
				],
				expandable: { width: 40 },
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [, genExpandableCol] = useExpandable(props, emits as any, {})
			const expandableCol = genExpandableCol({ width: 40 }, props.columns)

			expect(expandableCol.fixed).toBe('none')
		})
	})
})
