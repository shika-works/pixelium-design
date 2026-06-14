export type IconWrapperProps = {
	size?: 'mini' | 'small' | 'medium' | 'large'
	color?: string
	hoverColor?: string
	pressColor?: string
	activeColor?: string
	disabledColor?: string
	activeDisabledColor?: string
	disabled?: boolean
	active?: boolean
}

export type IconWrapperSlots = {
	/**
	 * @slot default
	 * @version 0.0.0-beta
	 */
	default: {}
}
