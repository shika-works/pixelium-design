import { ref, type Ref } from 'vue'
import { logWarn } from '../share/util/console'
import type { UseFormReturn, FormValidateResult, UseFormRegisterOptions } from './type'
import { getByPath, isArray, setByPath } from 'parsnip-kit'

export function useForm<T extends Record<string | number, any> = Record<string | number, any>>(
	options: {
		initialValues?: T
	} = {}
): UseFormReturn<T> {
	const funcRegister = {
		validateFn: null as ((field?: string | string[]) => FormValidateResult) | null,
		clearValidationFn: null as ((field?: string | string[]) => void) | null
	}

	const model = ref({ ...options.initialValues }) as Ref<T>

	const validate = async (field?: string | string[]): FormValidateResult => {
		if (!funcRegister.validateFn) {
			logWarn(
				'Validation function not registered. Ensure the Form component is properly mounted.'
			)
			return { isValid: false, results: {} }
		}
		return await funcRegister.validateFn(field)
	}

	const register = (registerOptions: UseFormRegisterOptions) => {
		funcRegister.validateFn = registerOptions.validate
		funcRegister.clearValidationFn = registerOptions.clearValidation
	}

	const reset = (field?: string | string[]): void => {
		if (!field) {
			model.value = { ...options.initialValues } as T
		} else {
			const nextModel = { ...model.value }
			const fields = isArray(field) ? field : [field]
			fields.forEach((fieldPath) => {
				setByPath(
					nextModel,
					fieldPath,
					!options.initialValues ? undefined : getByPath(options.initialValues, fieldPath)
				)
			})
			model.value = nextModel
		}
		if (funcRegister.clearValidationFn) {
			funcRegister.clearValidationFn(field)
		} else {
			logWarn('Clear Validation not registered. Ensure the Form component is properly mounted.')
		}
	}

	const clearValidation = (field?: string | string[]): void => {
		if (funcRegister.clearValidationFn) {
			funcRegister.clearValidationFn(field)
		} else {
			logWarn(
				'Clear Validation function not registered. Ensure the Form component is properly mounted.'
			)
		}
	}

	return {
		model,
		validate,
		register,
		reset,
		clearValidation
	}
}
