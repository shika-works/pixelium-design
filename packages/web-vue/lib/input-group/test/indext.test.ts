import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick, isRef } from 'vue'
import Button from '../../button/index.vue'
import InputGroup from '../index.vue'
import AutoComplete from '../../auto-complete/index.vue'
import Input from '../../input/index.vue'
import InputNumber from '../../input-number/index.vue'
import InputTag from '../../input-tag/index.vue'
import InputGroupLabel from '../../input-group-label/index.vue'
import Select from '../../select/index.vue'
import { createMocks } from '../../share/util/test'

describe('InputGroup', () => {
	const { post, pre } = createMocks()
	beforeEach(() => {
		pre()
	})
	afterEach(() => {
		post()
	})
	describe('should correctly update index, first and last when buttons are toggled with v-if', async () => {
		const defaultStateGetter = (x: any) => x.vm
		const specialStateGetter = (x: any) => {
			const state = x.getCurrentComponent().exposed
			const res: any = {}
			Object.keys(state).forEach((key) => {
				res[key] = isRef(state[key]) ? state[key].value : state[key]
			})
			return res
		}
		const list = [
			{
				component: Button,
				getter: defaultStateGetter
			},
			{
				component: AutoComplete,
				getter: specialStateGetter
			},
			{
				component: Input,
				getter: defaultStateGetter
			},
			{
				component: InputNumber,
				getter: defaultStateGetter
			},
			{
				component: InputTag,
				getter: defaultStateGetter
			},
			{
				component: InputGroupLabel,
				getter: defaultStateGetter
			},
			{
				component: Select,
				getter: specialStateGetter
			}
		]

		for (let i = 0; i < list.length; i++) {
			const cur = list[i].component
			const getter = list[i].getter
			it(cur.name || '', async () => {
				const showSecond = ref(true)
				const showThird = ref(true)

				const wrapper = mount({
					components: { Cur: cur, InputGroup },
					setup() {
						return { showSecond, showThird }
					},
					template: `
					<InputGroup>
						<Cur>${cur.name || ''} 1</Cur>
						<Cur v-if="showSecond">${cur.name || ''} 2</Cur>
						<Cur v-if="showThird">${cur.name || ''} 3</Cur>
					</InputGroup>
				`
				})

				const curs = wrapper.findAllComponents(cur)

				expect(curs.length).toBe(3)

				await nextTick()

				const curInstances = curs.map((cur) => getter(cur))

				// @ts-ignore
				expect(curInstances[0].index).toBe(0)
				// @ts-ignore
				expect(curInstances[0].first).toBe(true)
				// @ts-ignore
				expect(curInstances[0].last).toBe(false)

				// @ts-ignore
				expect(curInstances[1].index).toBe(1)
				// @ts-ignore
				expect(curInstances[1].first).toBe(false)
				// @ts-ignore
				expect(curInstances[1].last).toBe(false)

				// @ts-ignore
				expect(curInstances[2].index).toBe(2)
				// @ts-ignore
				expect(curInstances[2].first).toBe(false)
				// @ts-ignore
				expect(curInstances[2].last).toBe(true)

				showSecond.value = false
				await nextTick()

				const cursAfterHide = wrapper.findAllComponents(cur)
				const curInstancesAfterHide = cursAfterHide.map((cur) => getter(cur))

				expect(curInstancesAfterHide.length).toBe(2)

				// @ts-ignore
				expect(curInstancesAfterHide[0].index).toBe(0)
				// @ts-ignore
				expect(curInstancesAfterHide[0].first).toBe(true)
				// @ts-ignore
				expect(curInstancesAfterHide[0].last).toBe(false)

				// @ts-ignore
				expect(curInstancesAfterHide[1].index).toBe(1)
				// @ts-ignore
				expect(curInstancesAfterHide[1].first).toBe(false)
				// @ts-ignore
				expect(curInstancesAfterHide[1].last).toBe(true)

				showThird.value = false
				await nextTick()

				const cursAfterHideThird = wrapper.findAllComponents(cur)
				const curInstancesAfterHideThird = cursAfterHideThird.map((cur) => getter(cur))

				expect(curInstancesAfterHideThird.length).toBe(1)

				// @ts-ignore
				expect(curInstancesAfterHideThird[0].index).toBe(0)
				// @ts-ignore
				expect(curInstancesAfterHideThird[0].first).toBe(true)
				// @ts-ignore
				expect(curInstancesAfterHideThird[0].last).toBe(true)

				showSecond.value = true
				showThird.value = true
				await nextTick()

				const cursAfterShow = wrapper.findAllComponents(cur)
				const curInstancesAfterShow = cursAfterShow.map((cur) => getter(cur))

				expect(curInstancesAfterShow.length).toBe(3)

				// @ts-ignore
				expect(curInstancesAfterShow[0].index).toBe(0)
				// @ts-ignore
				expect(curInstancesAfterShow[0].first).toBe(true)
				// @ts-ignore
				expect(curInstancesAfterShow[0].last).toBe(false)

				// @ts-ignore
				expect(curInstancesAfterShow[1].index).toBe(1)
				// @ts-ignore
				expect(curInstancesAfterShow[1].first).toBe(false)
				// @ts-ignore
				expect(curInstancesAfterShow[1].last).toBe(false)

				// @ts-ignore
				expect(curInstancesAfterShow[2].index).toBe(2)
				// @ts-ignore
				expect(curInstancesAfterShow[2].first).toBe(false)
				// @ts-ignore
				expect(curInstancesAfterShow[2].last).toBe(true)
			})
		}
	})
})
