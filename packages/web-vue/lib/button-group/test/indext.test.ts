import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import Button from '../../button/index.vue'
import ButtonGroup from '../index.vue'

describe('ButtonGroup', () => {
	it('should correctly update index, first and last when buttons are toggled with v-if', async () => {
		const showSecond = ref(true)
		const showThird = ref(true)

		const wrapper = mount({
			components: { Button, ButtonGroup },
			setup() {
				return { showSecond, showThird }
			},
			template: `
        <ButtonGroup>
          <Button>Button 1</Button>
          <Button v-if="showSecond">Button 2</Button>
          <Button v-if="showThird">Button 3</Button>
        </ButtonGroup>
      `
		})

		const buttons = wrapper.findAllComponents(Button)

		expect(buttons.length).toBe(3)

		const buttonInstances = buttons.map((button) => button.vm)

		await nextTick()
		// @ts-ignore
		expect(buttonInstances[0].index).toBe(0)
		// @ts-ignore
		expect(buttonInstances[0].first).toBe(true)
		// @ts-ignore
		expect(buttonInstances[0].last).toBe(false)

		// @ts-ignore
		expect(buttonInstances[1].index).toBe(1)
		// @ts-ignore
		expect(buttonInstances[1].first).toBe(false)
		// @ts-ignore
		expect(buttonInstances[1].last).toBe(false)

		// @ts-ignore
		expect(buttonInstances[2].index).toBe(2)
		// @ts-ignore
		expect(buttonInstances[2].first).toBe(false)
		// @ts-ignore
		expect(buttonInstances[2].last).toBe(true)

		showSecond.value = false
		await nextTick()

		const buttonsAfterHide = wrapper.findAllComponents(Button)
		const buttonInstancesAfterHide = buttonsAfterHide.map((button) => button.vm)

		expect(buttonInstancesAfterHide.length).toBe(2)

		// @ts-ignore
		expect(buttonInstancesAfterHide[0].index).toBe(0)
		// @ts-ignore
		expect(buttonInstancesAfterHide[0].first).toBe(true)
		// @ts-ignore
		expect(buttonInstancesAfterHide[0].last).toBe(false)

		// @ts-ignore
		expect(buttonInstancesAfterHide[1].index).toBe(1)
		// @ts-ignore
		expect(buttonInstancesAfterHide[1].first).toBe(false)
		// @ts-ignore
		expect(buttonInstancesAfterHide[1].last).toBe(true)

		showThird.value = false
		await nextTick()

		const buttonsAfterHideThird = wrapper.findAllComponents(Button)
		const buttonInstancesAfterHideThird = buttonsAfterHideThird.map((button) => button.vm)

		expect(buttonInstancesAfterHideThird.length).toBe(1)

		// @ts-ignore
		expect(buttonInstancesAfterHideThird[0].index).toBe(0)
		// @ts-ignore
		expect(buttonInstancesAfterHideThird[0].first).toBe(true)
		// @ts-ignore
		expect(buttonInstancesAfterHideThird[0].last).toBe(true)

		showSecond.value = true
		showThird.value = true
		await nextTick()

		const buttonsAfterShow = wrapper.findAllComponents(Button)
		const buttonInstancesAfterShow = buttonsAfterShow.map((button) => button.vm)

		expect(buttonInstancesAfterShow.length).toBe(3)

		// @ts-ignore
		expect(buttonInstancesAfterShow[0].index).toBe(0)
		// @ts-ignore
		expect(buttonInstancesAfterShow[0].first).toBe(true)
		// @ts-ignore
		expect(buttonInstancesAfterShow[0].last).toBe(false)

		// @ts-ignore
		expect(buttonInstancesAfterShow[1].index).toBe(1)
		// @ts-ignore
		expect(buttonInstancesAfterShow[1].first).toBe(false)
		// @ts-ignore
		expect(buttonInstancesAfterShow[1].last).toBe(false)

		// @ts-ignore
		expect(buttonInstancesAfterShow[2].index).toBe(2)
		// @ts-ignore
		expect(buttonInstancesAfterShow[2].first).toBe(false)
		// @ts-ignore
		expect(buttonInstancesAfterShow[2].last).toBe(true)
	})
})
