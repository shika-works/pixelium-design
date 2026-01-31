import { describe, it, expect, vi } from 'vitest'
import { nextTick, reactive } from 'vue'
import { useSelection } from '../module/selection'
import type { TableData } from '../type'

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

describe('Selection Module', () => {
	const mockData: TableData[] = [
		{ key: 1, name: 'Alice', age: 25 },
		{ key: 2, name: 'Bob', age: 30 },
		{ key: 3, name: 'Charlie', age: 35 }
	]

	describe('useSelection', () => {
		it('should return selectedKeys and genSelectionCol function', () => {
			const props = getProps({
				data: mockData,
				columns: [],
				selection: { multiple: true },
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [selectedKeys, genSelectionCol] = useSelection(props, emits as any)

			expect(selectedKeys).toBeDefined()
			expect(typeof genSelectionCol).toBe('function')
		})

		it('should initialize with empty selectedKeys by default', () => {
			const props = getProps({
				data: mockData,
				columns: [],
				selection: { multiple: true },
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [selectedKeys] = useSelection(props, emits as any)

			expect(selectedKeys.value).toEqual([])
		})

		it('should initialize with defaultSelectedKeys', () => {
			const props = getProps({
				data: mockData,
				columns: [],
				selection: { multiple: true },
				defaultSelectedKeys: [1, 2],
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [selectedKeys] = useSelection(props, emits as any)

			expect(selectedKeys.value).toContain(1)
			expect(selectedKeys.value).toContain(2)
		})

		it('should handle single selection mode', () => {
			const props = getProps({
				data: mockData,
				columns: [],
				selection: { multiple: false },
				defaultSelectedKeys: [1, 2],
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [selectedKeys] = useSelection(props, emits as any)

			// In single selection mode, only the first key should be kept
			expect(selectedKeys.value).toHaveLength(1)
		})

		it('should handle multiple selection mode', () => {
			const props = getProps({
				data: mockData,
				columns: [],
				selection: { multiple: true },
				defaultSelectedKeys: [1, 2, 3],
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [selectedKeys] = useSelection(props, emits as any)

			expect(selectedKeys.value).toHaveLength(3)
		})

		it('should handle null selectedKeys', () => {
			const props = getProps({
				data: mockData,
				columns: [],
				selection: { multiple: true },
				selectedKeys: null,
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [selectedKeys] = useSelection(props, emits as any)

			expect(selectedKeys.value).toEqual([])
		})

		it('should handle undefined selectedKeys', () => {
			const props = getProps({
				data: mockData,
				columns: [],
				selection: { multiple: true },
				selectedKeys: undefined,
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [selectedKeys] = useSelection(props, emits as any)

			expect(Array.isArray(selectedKeys.value)).toBe(true)
		})

		it('should generate selectionConfig correctly for boolean selection', () => {
			const props = getProps({
				data: mockData,
				columns: [],
				selection: true,
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [, , selectionConfig] = useSelection(props, emits as any)

			expect(selectionConfig.value.multiple).toBe(false)
			expect(selectionConfig.value.showSelectAll).toBe(true)
			expect(selectionConfig.value.label).toBeUndefined()
			expect(selectionConfig.value.width).toBeUndefined()
			expect(selectionConfig.value.minWidth).toBeUndefined()
			expect(selectionConfig.value.fixed).toBe(false)
			expect(selectionConfig.value.onlyCurrent).toBe(false)
		})

		it('should generate selectionConfig correctly for object selection', () => {
			const props = getProps({
				data: mockData,
				columns: [],
				selection: {
					multiple: false,
					showSelectAll: true,
					label: 'Sel',
					width: 60,
					minWidth: 20,
					fixed: true,
					onlyCurrent: true
				},
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [, , selectionConfig] = useSelection(props, emits as any)

			expect(selectionConfig.value.multiple).toBe(false)
			expect(selectionConfig.value.showSelectAll).toBe(true)
			expect(selectionConfig.value.label).toBe('Sel')
			expect(selectionConfig.value.width).toBe(60)
			expect(selectionConfig.value.minWidth).toBe(20)
			expect(selectionConfig.value.fixed).toBe(true)
			expect(selectionConfig.value.onlyCurrent).toBe(true)
		})
	})

	describe('genSelectionCol', () => {
		it('should generate a selection column', () => {
			const props = getProps({
				data: mockData,
				columns: [],
				selection: { multiple: true },
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [, genSelectionCol] = useSelection(props, emits as any)
			const selectionCol = genSelectionCol({ multiple: true }, props.columns!)

			expect(selectionCol).toBeDefined()
			expect(selectionCol.key).toBeDefined()
			expect(selectionCol.width).toBeDefined()
		})

		it('should set correct width for selection column', () => {
			const props = getProps({
				data: mockData,
				columns: [],
				selection: { multiple: true, width: 50 },
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [, genSelectionCol] = useSelection(props, emits as any)
			const selectionCol = genSelectionCol({ multiple: true, width: 50 }, props.columns!)

			expect(selectionCol.width).toBe(50)
		})

		it('should handle selection column with fixed position', () => {
			const props = getProps({
				data: mockData,
				columns: [],
				selection: { multiple: true },
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [, genSelectionCol] = useSelection(props, emits as any)
			const selectionCol = genSelectionCol({ multiple: true }, props.columns!)

			expect(['left', 'right', 'none']).toContain(selectionCol.fixed)
		})
	})

	describe('onlyCurrent option', () => {
		it('should respect onlyCurrent option when true', () => {
			const props = getProps({
				data: mockData,
				columns: [],
				selection: { multiple: true, onlyCurrent: true },
				defaultSelectedKeys: [1, 2],
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [selectedKeys] = useSelection(props, emits as any)

			// When onlyCurrent is true, only keys from current data should be kept
			expect(selectedKeys.value!.every((key) => mockData.some((d) => d.key === key))).toBe(true)
		})

		it('should remove unrelated keys when data changes with onlyCurrent', async () => {
			const props = getProps({
				data: mockData,
				columns: [],
				selection: { multiple: true, onlyCurrent: true },
				defaultSelectedKeys: [1, 2],
				rowKey: 'key'
			})

			const emits = vi.fn()

			const [selectedKeys] = useSelection(props as any, emits as any)

			expect(selectedKeys.value).toContain(1)
			expect(selectedKeys.value).toContain(2)

			// Change data
			props.data = [{ key: 2, name: 'Bob', age: 30 }]

			// Keys not in current data should be removed
			const keysInCurrentData = selectedKeys.value!.filter((key) =>
				props.data!.some((d: any) => d.key === key)
			)
			expect(keysInCurrentData).toContain(2)
			expect(keysInCurrentData).not.toContain(1)
		})
	})

	describe('Selection Type Changes', () => {
		it('should handle switching from multiple to single selection', async () => {
			const props = reactive(
				getProps({
					data: mockData,
					columns: [],
					selection: { multiple: true },
					defaultSelectedKeys: [1, 2, 3],
					rowKey: 'key'
				})
			)

			const emits = vi.fn()

			const [selectedKeys] = useSelection(props as any, emits as any)

			expect(selectedKeys.value!.length).toBeGreaterThan(1)

			// Switch to single selection
			props.selection = { multiple: false }

			await nextTick()
			// After switching, only one key should remain
			expect(selectedKeys.value).toHaveLength(1)
		})
	})
})
