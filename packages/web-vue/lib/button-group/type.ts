import type { Ref, ToRefs } from 'vue'
import type { LooseRequired, NumberOrPercentage } from '../share/type'
import type { ButtonProps } from '../button/type'

export type ButtonGroupProps = {
	/**
	 * @property {NumberOrPercentage | NumberOrPercentage[]} [borderRadius]
	 * @version 0.0.0-beta
	 */
	borderRadius?: NumberOrPercentage | NumberOrPercentage[]
	/**
	 * @property {'rect' | 'round' | 'square' | 'circle'} [shape]
	 * @version 0.0.0-beta
	 */
	shape?: 'rect' | 'round' | 'default' | 'square' | 'circle'
	/**
	 * @property {'medium' | 'large' | 'small'} [size='medium']
	 * @version 0.0.3
	 */
	size?: 'medium' | 'large' | 'small'
	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.0.0-beta
	 */
	disabled?: boolean
	/**
	 * @property {boolean} [loading=false]
	 * @version 0.0.0-beta
	 */
	loading?: boolean
	/**
	 * @property {'primary' | 'plain' | 'text' | 'outline'} [variant]
	 * @version 0.0.0-beta
	 */
	variant?: 'primary' | 'plain' | 'text' | 'outline'
	/**
	 * @property {'primary' | 'sakura' | 'success' | 'warning' | 'danger' | 'info'} [theme]
	 * @version 0.0.0-beta
	 */
	theme?: 'primary' | 'sakura' | 'success' | 'warning' | 'danger' | 'info'
	/**
	 * @property {boolean} [pollSizeChange=false]
	 * @version 0.1.0
	 */
	pollSizeChange?: boolean
}

export type ButtonGroupSlots = {
	/**
	 * @slot default
	 * @version 0.0.0-beta
	 */
	default: {}
}

export type ChildrenInfo = {
	id: string
	variant?: ButtonProps['variant']
	index: number
}

export type ButtonGroupProvide = ToRefs<LooseRequired<ButtonGroupProps>> & {
	childrenInfo: Ref<ChildrenInfo[]>
	collectChildrenInfo: (info: ChildrenInfo) => void
	removeChildrenInfo: (id: string) => void
	id: string
}
