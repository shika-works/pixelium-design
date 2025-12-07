import { isString } from 'parsnip-kit'
import { getCurrentInstance, onUpdated, ref, type Ref } from 'vue'

export function usePropsDetect<T extends Record<string, any>, U extends keyof T>(
	props: T,
	fields?: Array<U> | U,
	emptyValues?: Record<U, any>
) {
	const instance = getCurrentInstance()
	const fieldsToCheck = ((isString(fields) ? [fields] : fields) ||
		Object.keys(props)) as Array<U>

	const update = () => {
		const rawProps = instance?.vnode.props || ({} as any)

		return fieldsToCheck.reduce(
			(acc, field) => {
				if (emptyValues) {
					if (field in emptyValues) {
						acc[field] = field in rawProps && rawProps[field] !== emptyValues[field]
					} else {
						acc[field] = field in rawProps
					}
				} else {
					acc[field] = field in rawProps && rawProps[field] !== undefined
				}
				return acc
			},
			{} as Record<U, boolean>
		)
	}

	const detect = ref(update()) as Ref<Record<U, boolean>>

	onUpdated(() => {
		detect.value = update()
	})

	return detect
}
