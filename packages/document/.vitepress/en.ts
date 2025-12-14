import { defineConfig } from 'vitepress'
import { dfs4Md } from './dfs-4-md'

const titleMap = {
	starting: 'Quickly Starting',
	intro: 'Introduction',
	theme: 'Custom Theme'
}
const additionMap = {}
const sidebar = dfs4Md('en', titleMap, additionMap)

export default defineConfig({
	title: 'Pixelium Design',
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: 'Home', link: '/en' },
			{ text: 'Doc', link: '/en/guide/intro' }
		],
		sidebar: sidebar
	}
})
