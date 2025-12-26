import type { Ref, ToRefs } from 'vue'
import type { LooseRequired, NumberOrPercentage } from '../share/type'
import type { ChildrenInfo } from '../button-group/type'

export type InputGroupProps = {
	/**
	 * @property {NumberOrPercentage | NumberOrPercentage[]} [borderRadius]
	 * @version 0.0.2
	 */
	borderRadius?: NumberOrPercentage | NumberOrPercentage[]
	/**
	 * @property {'rect' | 'round'} [shape='rect']
	 * @version 0.0.3
	 */
	shape?: 'rect' | 'round' | 'default'
	/**
	 * @property {'medium' | 'large' | 'small'} [size='medium']
	 * @version 0.0.2
	 */
	size?: 'medium' | 'large' | 'small'
	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.0.2
	 */
	disabled?: boolean
	/**
	 * @property {boolean} [readonly=false]
	 * @version 0.0.3
	 */
	readonly?: boolean
	/**
	 * @property {boolean} [pollSizeChange=false]
	 * @version 0.1.0
	 */
	pollSizeChange?: boolean
}

export type InputGroupSlots = {
	/**
	 * @slot default
	 * @version 0.0.2
	 */
	default: {}
}

export type InputGroupProvide = ToRefs<LooseRequired<InputGroupProps>> & {
	childrenInfo: Ref<ChildrenInfo[]>
	collectChildrenInfo: (info: ChildrenInfo) => void
	removeChildrenInfo: (id: string) => void
}
