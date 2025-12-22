<template>
	<Row class="px-form-item" :gutter="{ x: 16, y: 8 }" v-bind="mergedProps.rowProps">
		<Col
			v-if="label || slots.label"
			:span="mergedProps.labelAlign === 'top' ? 24 : 6"
			class="px-form-item-label-wrapper"
			:class="{
				'px-form-item-label-wrapper__auto': mergedProps.labelAutoWidth
			}"
			:style="{
				width: mergedProps.labelAutoWidth ? `${formContext.maxLabelWidth.value}px` : undefined
			}"
			v-bind="mergedProps.labelProps"
		>
			<label
				class="px-form-item-label"
				ref="labelRef"
				:class="{
					'px-form-item-label__auto': mergedProps.labelAutoWidth,
					[`px-form-item-label__${mergedProps.labelAlign}`]:
						mergedProps.labelAlign && mergedProps.labelAlign !== 'top',
					[`px-form-item-label__${mergedProps.size}`]: mergedProps.size
				}"
			>
				<span
					v-if="shouldShowAsterisk && mergedProps.asteriskPlacement === 'left'"
					class="px-form-item-asterisk"
				>
					*&nbsp;
				</span>
				<slot name="label">
					<span>{{ label }}</span>
				</slot>
				<span
					v-if="shouldShowAsterisk && mergedProps.asteriskPlacement === 'right'"
					class="px-form-item-asterisk"
				>
					&nbsp;*
				</span>
			</label>
		</Col>
		<Col
			:span="mergedProps.labelAlign === 'top' || (!label && !slots.label) ? 24 : 18"
			class="px-form-item-content-wrapper"
			:class="{
				'px-form-item-content-wrapper__auto': mergedProps.labelAutoWidth
			}"
			v-bind="mergedProps.contentProps"
		>
			<div
				class="px-form-item-content"
				:class="{
					[`px-form-item-content__${mergedProps.size}`]: mergedProps.size
				}"
			>
				<slot></slot>
				<span
					v-if="shouldShowAsterisk && mergedProps.asteriskPlacement === 'end'"
					class="px-form-item-asterisk"
				>
					&nbsp;*
				</span>
			</div>
			<div class="px-form-item-addition">
				<div
					class="px-form-item-tip"
					v-if="tipMessage.message || slots.tip"
					:class="{
						[`px-form-item-tip__${tipMessage.level}`]: tipMessage.level
					}"
				>
					<slot name="tip" :message="tipMessage.message" :level="tipMessage.level">
						{{ tipMessage.message }}
					</slot>
				</div>
				<div class="px-form-item-extra" v-if="slots.extra">
					<slot name="extra"> </slot>
				</div>
			</div>
		</Col>
	</Row>
</template>

<script setup lang="ts">
import {
	computed,
	inject,
	nextTick,
	onBeforeUnmount,
	onMounted,
	onUnmounted,
	provide,
	ref,
	shallowRef,
	useId,
	useSlots
} from 'vue'
import { FORM_ITEM_PROVIDE, FORM_PROVIDE } from '../share/const/provide-key'
import type { FormProps, FormProvide, RuleLevel, RuleTrigger } from '../form/type'
import { throwError } from '../share/util/console'
import Row from '../row/index.vue'
import Col from '../col/index.vue'
import type { FormItemProps, FormItemProvide } from './type'
import {
	getByPath,
	isArray,
	isBoolean,
	isFunction,
	isNullish,
	isNumber,
	isNumberString,
	isObjectLike,
	isString,
	mergeSkipNullish,
	omit,
	setByPath,
	mapFields,
	isEmpty,
	isEmail
} from 'parsnip-kit'
import { isUrl } from '../share/util/common'
import { useResizeObserver } from '../share/hook/use-resize-observer'
import type { LooseRequired } from '../share/type'
import { createProvideComputed } from '../share/util/reactivity'

defineOptions({ name: 'FormItem' })

const props = withDefaults(defineProps<FormItemProps>(), {
	disabled: undefined,
	readonly: undefined,
	showAsterisk: undefined,
	asteriskPlacement: undefined,
	labelAlign: undefined,
	rowProps: undefined,
	labelProps: undefined,
	contentProps: undefined
})

const formContext = inject<FormProvide | undefined>(FORM_PROVIDE, undefined)!

if (!formContext) {
	throwError('FormItem must be used inside Form.')
}

const disabledComputed = createProvideComputed('disabled', [formContext, props], 'or')
const readonlyComputed = createProvideComputed('readonly', [formContext, props], 'or')
const pollSizeChangeComputed = createProvideComputed(
	'pollSizeChange',
	[formContext, props],
	'or'
)

const id = useId()

const slots = useSlots()

const IGNORE_CONTEXT_FIELDS = [
	'model',
	'rule',
	'registerField',
	'unregisterField',
	'collectLabelWidth',
	'removeLabelWidth'
] as const
const mergedProps = computed(() => {
	const omitted = omit(formContext, IGNORE_CONTEXT_FIELDS)
	const mapped = mapFields(omitted, (e) => e.value)
	return mergeSkipNullish(
		mapped as Omit<LooseRequired<FormProps>, 'model' | 'rule'> & { maxLabelWidth: number },
		props
	)
})

const labelRef = shallowRef<HTMLLabelElement | null>(null)

useResizeObserver(
	labelRef,
	() => {
		if (!labelRef.value) {
			return
		}
		formContext.collectLabelWidth({
			id,
			width: labelRef.value.clientWidth
		})
	},
	true
)
onBeforeUnmount(() => {
	formContext.removeLabelWidth(id)
})

let initValue: any = null

const reset = async () => {
	if (!props.field) {
		return
	}
	setByPath(formContext.model.value, props.field, initValue)
	await nextTick()
	clearValidation()
}

const createFieldItem = () => {
	return {
		field: props.field!,
		validate: doValidate,
		reset,
		clearValidation
	}
}

onMounted(() => {
	if (props.field) {
		formContext.registerField(createFieldItem())
		initValue = getByPath(formContext.model.value, props.field)
	}
})

onUnmounted(() => {
	if (props.field) {
		formContext.unregisterField(props.field)
	}
})

const shouldShowAsterisk = computed(() => {
	if (!mergedProps.value.showAsterisk) {
		return
	}
	if (!props.field) {
		return false
	}
	let rules = props.rule || formContext.rules.value?.[props.field]
	if (!rules) {
		return false
	}
	if (!isArray(rules)) {
		rules = [rules]
	}
	return rules.some((rule) => rule.required)
})

const inputHandler = async () => {
	if (!props.field) {
		return
	}
	await nextTick()
	doValidate('input')
}

const blurHandler = async () => {
	if (!props.field) {
		return
	}
	await nextTick()
	doValidate('blur')
}

const changeHandler = async () => {
	if (!props.field) {
		return
	}
	await nextTick()
	doValidate('change')
}

const formatTipMessage = (nextMessage?: { message?: string | void; level?: RuleLevel }) => {
	return {
		message: nextMessage?.message || '',
		level: !nextMessage?.message ? 'normal' : nextMessage?.level || 'normal'
	}
}

const tipMessage = ref<{
	message: string
	level: RuleLevel
}>(formatTipMessage())

const clearValidation = () => {
	tipMessage.value = formatTipMessage()
}

const provideStatus = computed(() => {
	return tipMessage.value.level
})

provide<FormItemProvide>(FORM_ITEM_PROVIDE, {
	size: formContext.size,
	disabled: disabledComputed,
	readonly: readonlyComputed,
	pollSizeChange: pollSizeChangeComputed,
	changeHandler,
	blurHandler,
	inputHandler,
	status: provideStatus
})

const doValidate = async (trigger?: RuleTrigger) => {
	if (!props.field) {
		tipMessage.value = formatTipMessage()
		return tipMessage.value
	}
	let rules = props.rule || formContext.rules.value?.[props.field]

	if (!rules) {
		tipMessage.value = formatTipMessage()
		return tipMessage.value
	}
	if (!isArray(rules)) {
		rules = [rules]
	}
	const value = getByPath(formContext.model.value, props.field)

	const currentRules = trigger
		? rules.filter((rule) =>
				rule.trigger
					? isArray(rule.trigger)
						? rule.trigger.includes(trigger)
						: rule.trigger === trigger
					: trigger === 'change' || trigger === 'blur'
			)
		: rules

	if (currentRules.length === 0) {
		return tipMessage.value
	}

	for (const rule of currentRules) {
		if (rule.validator) {
			try {
				const ret = await Promise.resolve(rule.validator(value, formContext.model))
				tipMessage.value = formatTipMessage({
					message: ret,
					level: rule.level || 'error'
				})
				return tipMessage.value
			} catch {
				tipMessage.value = formatTipMessage({
					message: rule.message ?? `${props.field} didn't pass the check.`,
					level: rule.level || 'error'
				})
				return tipMessage.value
			}
		}

		if (rule.required && isEmpty(value)) {
			tipMessage.value = formatTipMessage({
				message: rule.message ?? `${props.field} is required`,
				level: rule.level || 'error'
			})
			return tipMessage.value
		}
		if (rule.type) {
			const types = Array.isArray(rule.type) ? rule.type : [rule.type]
			const ok = types.some((t) => {
				switch (t) {
					case 'number':
						return isNumber(value) && !isNaN(value)
					case 'string':
						return isString(value)
					case 'boolean':
						return isBoolean(value)
					case 'array':
						return isArray(value)
					case 'dict':
						return isObjectLike(value) && !isArray(value)
					case 'function':
						return isFunction(value)
					case 'date':
						return value instanceof Date && !isNaN(value.getTime())
					default:
						return true
				}
			})
			if (!ok) {
				tipMessage.value = formatTipMessage({
					message: rule.message ?? `${props.field} type mismatch`,
					level: rule.level || 'error'
				})
				return tipMessage.value
			}
		}

		if (isNumber(value)) {
			if (!isNullish(rule.min) && value < rule.min) {
				tipMessage.value = formatTipMessage({
					message: rule.message ?? `${props.field} must be >= ${rule.min}`,
					level: rule.level || 'error'
				})
				return tipMessage.value
			}
			if (!isNullish(rule.max) && value > rule.max) {
				tipMessage.value = formatTipMessage({
					message: rule.message ?? `${props.field} must be <= ${rule.max}`,
					level: rule.level || 'error'
				})
				return tipMessage.value
			}
		}

		if (isString(value) || isArray(value)) {
			const len = (value as any).length
			if (!isNullish(rule.minLength) && len < rule.minLength) {
				tipMessage.value = formatTipMessage({
					message: rule.message ?? `${props.field} length must be >= ${rule.minLength}`,
					level: rule.level || 'error'
				})
				return tipMessage.value
			}
			if (!isNullish(rule.maxLength) && len > rule.maxLength) {
				tipMessage.value = formatTipMessage({
					message: rule.message ?? `${props.field} length must be <= ${rule.maxLength}`,
					level: rule.level || 'error'
				})
				return tipMessage.value
			}
		}

		if (rule.email && !isEmail(value)) {
			tipMessage.value = formatTipMessage({
				message: rule.message ?? `${props.field} is not a valid email.`,
				level: rule.level || 'error'
			})
			return tipMessage.value
		}
		if (rule.url && !isUrl(value)) {
			tipMessage.value = formatTipMessage({
				message: rule.message ?? `${props.field} is not a valid URL.`,
				level: rule.level || 'error'
			})
			return tipMessage.value
		}
		if (rule.numberString && !isNumberString(value)) {
			tipMessage.value = formatTipMessage({
				message: rule.message ?? `${props.field} is not a valid numeric string.`,
				level: rule.level || 'error'
			})
			return tipMessage.value
		}
	}
	tipMessage.value = formatTipMessage()
	return tipMessage.value
}

defineExpose({
	validate: doValidate
})
</script>

<style lang="less" src="./index.less"></style>
<style lang="less" src="../share/style/index.css" />
