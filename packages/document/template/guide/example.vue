<template>
	<px-container class="dashboard-container">
		<px-header class="header-container" bordered>
			<px-space>
				LOGO
				<span class="logo-text">Project Name</span>
			</px-space>

			<px-space style="margin-left: auto">
				<px-tooltip content="Notifications">
					<div class="icon-button">
						<IconBell :size="24"></IconBell>
					</div>
				</px-tooltip>
				<px-avatar size="medium" style="display: block" />
				<span class="username">Admin User</span>
				<px-popover trigger="click" placement="bottom-end">
					<template #content>
						<px-space direction="vertical">
							<px-link>Coming soon</px-link>
							<px-link>Profile Settings</px-link>
							<px-link>Logout</px-link>
						</px-space>
					</template>
					<div class="icon-button">
						<IconAngleDown :size="24"></IconAngleDown>
					</div>
				</px-popover>
			</px-space>
		</px-header>

		<px-container class="main-layout">
			<px-aside class="sidebar-container" bordered dark>
				<px-menu dark>
					<px-menu-item v-for="item in menuItems" :key="item.key" :index="item.key">
						<span>{{ item.label }}</span>
						<px-tag
							v-if="item.badge"
							style="margin-left: 16px"
							size="small"
							variant="primary"
							>{{ item.badge }}</px-tag
						>
					</px-menu-item>
					<px-menu-item index="Documentation" style="margin-top: auto"
						>Documentation</px-menu-item
					>
					<px-menu-item index="Support">Support</px-menu-item>
				</px-menu>
			</px-aside>

			<px-container>
				<px-spin :loading="isLoading" style="width: 100%">
					<px-main soft class="content-container">
						<h4 pixelium>Form Area</h4>
						<px-form
							:model="form"
							:rules="rules"
							style="width: 500px"
							@submit="submitHandler"
							ref="formRef"
						>
							<px-form-item label="Input" field="input">
								<px-input v-model="form.input" placeholder="Please input..."></px-input>
							</px-form-item>
							<px-form-item label="Radio" field="radio">
								<px-radio-group
									v-model="form.radio"
									:options="radioOptions"
									variant="retro"
								></px-radio-group>
							</px-form-item>
							<px-form-item label="Checkbox" field="checkbox">
								<px-checkbox-group
									v-model="form.checkbox"
									:options="checkboxOptions"
								></px-checkbox-group>
							</px-form-item>
							<px-form-item label="Number" field="number">
								<px-input-number
									v-model="form.number"
									placeholder="Please input..."
								></px-input-number>
							</px-form-item>
							<px-form-item label="Tags" field="tags">
								<px-input-tag
									v-model="form.tags"
									placeholder="Press enter to confirm..."
								></px-input-tag>
							</px-form-item>
							<px-form-item label="Text" field="text">
								<px-textarea
									v-model="form.text"
									placeholder="Please input text..."
								></px-textarea>
							</px-form-item>
							<px-form-item label="Switch" field="switch">
								<px-switch v-model="form.switch"></px-switch>
							</px-form-item>
							<px-form-item label="Select" field="select">
								<px-select
									:options="options"
									v-model="form.select"
									placeholder="Please select..."
								></px-select>
							</px-form-item>
							<px-form-item label="Nest" field="nest.value">
								<px-input v-model="form.nest.value" placeholder="Please input..."></px-input>
							</px-form-item>
							<px-form-item label="Email" field="email">
								<px-input v-model="form.email" placeholder="Please email..."></px-input>
							</px-form-item>
							<px-form-item label="URL" field="url">
								<px-input v-model="form.url" placeholder="Please URL..."></px-input>
							</px-form-item>
							<px-form-item label="Slider" field="slider">
								<px-slider v-model="form.slider"></px-slider>
							</px-form-item>
							<px-form-item label="Number String" field="numberString">
								<px-input v-model="form.numberString" placeholder="Please number..."></px-input>
							</px-form-item>
							<px-space justify="end">
								<px-button native-type="submit">Submit</px-button>
								<px-button theme="info" native-type="reset" style="margin-left: 8px"
									>Reset</px-button
								>
							</px-space>
						</px-form>
					</px-main>
				</px-spin>

				<px-footer class="footer-container" bordered>
					<px-space style="font-size: 12px">
						© 2025 Component Dashboard
						<px-link>Terms</px-link>
						<px-link>Privacy</px-link>
					</px-space>
				</px-footer>
			</px-container>
		</px-container>
	</px-container>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { IconBell, IconAngleDown } from '@pixelium/web-vue/icon-hn/es'
import { Form } from '@pixelium/web-vue'
// State management
const isLoading = ref(true)

setTimeout(() => {
	isLoading.value = false
}, 2000)

// Menu items
const menuItems = [
	{ key: 'menu coming', label: 'Menu is coming soon' },
	{ key: 'dashboard', label: 'Dashboard', badge: 'New' },
	{ key: 'users', label: 'Users' },
	{ key: 'settings', label: 'Settings' },
	{ key: 'analytics', label: 'Analytics' },
	{ key: 'reports', label: 'Reports' }
]

const form = ref({
	input: '',
	number: 0,
	tags: [] as string[],
	text: '',
	nest: {
		value: ''
	},
	select: null as null | string,
	email: '',
	url: '',
	numberString: '',
	switch: false,
	radio: null as null | string,
	checkbox: [] as string[],
	slider: 10
})

const rules = {
	input: { required: true, message: 'Please input' },
	select: { required: true, message: 'Please select' },
	switch: { required: true, message: 'Please select' },
	number: { min: 10, message: 'Min is 10' },
	tags: [
		{ required: true, message: 'Please input tags' },
		{ maxLength: 5, message: 'Length less than or equal 5' }
	],
	text: { required: true, message: 'Just a tip', level: 'warning' },
	'nest.value': { required: true, message: 'Please input' },
	email: { required: true, email: true, message: 'Please input email' },
	url: { required: true, url: true, message: 'Please input a URL' },
	numberString: { required: true, numberString: true, message: 'Please input number' },
	radio: {
		required: true,
		validator(value: string) {
			return value !== 'Yes' ? 'Please select Yes' : undefined
		}
	},
	checkbox: [
		{ required: true, message: 'Please select' },
		{ maxLength: 2, message: 'You can select up to 2 items' }
	],
	slider: { max: 90, message: 'Max is 90' }
}

const options = ref(['vue', 'react', 'angular'])
const radioOptions = ref(['Yes', 'No'])
const checkboxOptions = ref(['A', 'B', 'C', 'D'])

const formRef = shallowRef<null | InstanceType<typeof Form>>(null)
const submitHandler = () => {
	formRef.value?.validate().then(({ isValid }) => {
		if (isValid) {
			console.log('submit')
		}
	})
}
</script>

<style lang="less" scoped>
.dashboard-container {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

.header-container {
	height: 64px;
	display: flex;
	align-items: center;
}

.logo-text {
	font-size: 20px;
	font-weight: bold;
}

.sidebar-container {
	width: 240px;
	padding: 16px 0;

	display: flex;
	flex-direction: column;
}

.sidebar-footer {
	padding: 0 16px;
}

.content-container {
	flex: 1;
	padding: 24px;
	overflow-y: auto;
}

.section-header {
	margin-bottom: 24px;
}

.demo-section {
	margin-bottom: 24px;
}

.icon-button {
	svg {
		display: block;
	}
	cursor: pointer;
}

.footer-container {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
