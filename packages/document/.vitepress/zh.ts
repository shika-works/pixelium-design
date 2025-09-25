import { defineConfig } from 'vitepress'
import { dfs4Md } from './dfs-4-md'

const titleMap = {
	starting: '快速开始',
	guide: '开始',
	intro: '简介',
	font: '字体',
	theme: '主题',
	'dark-mode': '暗黑模式'
}
const additionMap = {
	button: '按钮',
	icon: '图标',
	link: '链接',
	common: '通用组件',
	feedback: '反馈组件',
	config: '全局配置',
	message: '消息提示',
	layout: '布局组件',
	row: 'Flex 栅格',
	grid: 'Grid 栅格',
	divider: '分隔线',
	space: '间隔',
	container: '布局容器'
}

const sidebar = dfs4Md('zh', titleMap, additionMap)

export default defineConfig({
	title: 'Pixelium Design',
	themeConfig: {
		nav: [
			{ text: '首页', link: '/zh' },
			{ text: '文档', link: '/zh/guide/intro' }
		],
		sidebar: sidebar,
		search: {
			provider: 'local',
			options: {
				locales: {
					zh: {
						translations: {
							button: {
								buttonText: '搜索文档',
								buttonAriaLabel: '搜索文档'
							},
							modal: {
								noResultsText: '无法找到相关结果',
								resetButtonTitle: '清除查询条件',
								footer: {
									selectText: '选择',
									navigateText: '切换',
									closeText: '关闭搜索'
								}
							}
						}
					}
				}
			}
		}
	}
})
