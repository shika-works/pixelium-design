import { defineConfig } from 'vitepress'
import { dfs4Md } from './dfs-4-md'

const titleMap = {
	starting: 'Quickly Starting',
	intro: 'Introduction',
	'dark-mode': 'Dark Mode'
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
