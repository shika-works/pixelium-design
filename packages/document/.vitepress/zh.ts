import { defineConfig } from 'vitepress'
import { dfs4Md } from './dfs-4-md'
import { additionMapZh, newItems, titleMapZh } from './share'

const sidebar = dfs4Md('zh', titleMapZh, additionMapZh, newItems)

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
		},
		outline: {
			level: [2, 4]
		}
	}
})
